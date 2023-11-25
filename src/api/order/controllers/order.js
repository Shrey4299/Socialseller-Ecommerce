const { requestError } = require("../../../services/errors");
const { razorpay } = require("../../../utils/gateway");
const crypto = require("crypto");
const getWebhookBody = require("../services/getWebhookBody");
const uuid = require("uuid");
const axios = require("axios");
const verify = require("../services/cashfreeSignatureVerify");
const getCashfreeWebhookBody = require("../services/getCashfreeWebhookBody");
const productMetricsService = require("../../../services/productMetricsUpdate");
const { handleSuccessfulOrder } = require("../services/orderHandler");
const orederVariantCreation = require("../services/ordervariantCreation");
const orederVariantUpdate = require("../services/ordervariantCreation");

exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const newOrder = await Order.create(req.body);
    return res.status(201).send({
      message: "Order created successfully!",
      data: newOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create an order" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const orderId = req.params.id;

    const [updatedRowsCount, updatedOrder] = await Order.update(req.body, {
      where: { id: orderId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Order not found" });
    }

    return res.status(200).send({
      message: "Order updated successfully!",
      data: updatedOrder[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the order" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const orders = await Order.findAll({
      include: [
        {
          model: sequelize.models.Order_variant,
          as: "orderVariants",
          include: [
            {
              model: sequelize.models.Variant,
              as: "variant",
            },
          ],
        },
      ],
    });
    return res.status(200).send(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch orders" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const Order_variant_link = sequelize.models.Order_variant_link;

    const orderId = req.params.id;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: sequelize.models.Order_variant,
          as: "orderVariants",
          include: [
            {
              model: sequelize.models.Variant,
              as: "variant",
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    return res.status(200).send(order);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the order" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const orderId = req.params.id;
    const deletedRowCount = await Order.destroy({ where: { id: orderId } });

    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Order not found" });
    }

    return res.status(200).send({ message: "Order deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the order" });
  }
};

exports.checkOut = async (req, res) => {
  try {
    console.log("entered in razorpay checkout");
    const sequelize = req.db;
    const client = req.hostname.split(".")[0];
    console.log(client + "this is client");
    const { payment, UserStoreId, VariantId, quantity } = req.body;

    const variant = await sequelize.models.Variant.findByPk(VariantId);

    const amount = Number(variant.price * quantity);

    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: "RCT" + require("uid").uid(10).toUpperCase(),
    };

    const prePaidOrder = razorpay.orders.create(
      options,
      async function (error, order) {
        console.log(order);
        if (error) {
          return res.status(error.statusCode).send(
            requestError({
              status: error.statusCode,
              message: error.error.reason,
              details: error.error.description,
            })
          );
        }

        await createOrder(order);
        const orderWithClient = { ...order, client };
        return res.status(200).send(orderWithClient);
        // return res.status(200).send(...order, client);
      }
    );

    const createOrder = async (order) => {
      try {
        const orderProduct = await sequelize.models.Order.create({
          order_id: order.id,
          price: amount,
          UserStoreId: UserStoreId,
          payment: payment,
          status: "new",
          address: "user address",
          isPaid: false,
        });

        const result = await orederVariantCreation.createVariantOrder(
          quantity,
          VariantId,
          orderProduct.id,
          req,
          res
        );
      } catch (error) {
        console.log(error);
        return error;
      }
    };

    const productMetrics =
      await productMetricsService.createOrUpdateProductMetrics(
        sequelize,
        variant,
        amount
      );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch subscription" });
  }
};

exports.verify = async (req, res) => {
  try {
    console.error("entered in razorpay verify");
    console.info(req.body.client + " this is client in verify");

    const sequelize = req.db;
    const client = req.body.client;
    const razorpay_order_id = req.body.razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;

    console.log(razorpay_order_id + razorpay_payment_id);
    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log(generateSignature);
    console.log(razorpay_signature);

    if (generateSignature === razorpay_signature) {
      try {
        const user = await sequelize.models.User.findOne({
          where: { username: client },
        });

        const payment_log = await sequelize.models.Payment_log.update(
          { client: client, UserId: user.id },
          { where: { order_id: razorpay_order_id } }
        );
      } catch (error) {
        console.error("Error updating payment log:", error);
        throw error;
      }

      const result = await handleSuccessfulOrder(
        client,
        razorpay_order_id,
        razorpay_payment_id
      );

      const orderVariantUpdate = await orederVariantCreation.updateOrderVariant(
        razorpay_order_id,
        client
      );

      return res.status(200).send(result);
    } else {
      return res.status(400).send(
        requestError({
          message: "Bad Request!",
          details: "razorpay_signature and generated signature did not match!",
        })
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.webhook = async (req, res) => {
  try {
    console.log("entered in razorpay webhook");
    const body = req.body;
    const hookSignature = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRETE
    );
    const sequelize = req.db;
    hookSignature.update(JSON.stringify(req.body));
    const digest = hookSignature.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      return res.status(400).send({ error: "Invalid Request!" });
    }

    const webHookBody = await getWebhookBody(req);
    console.log(JSON.stringify(webHookBody));
    const payment_log = sequelize.models.Payment_log.create(webHookBody);
    return res.status(200).send(payment_log);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.createCashfreeOrder = async (req, res) => {
  try {
    console.error("entered in cashfree order");
    const order_id = uuid.v4();
    const sequelize = req.db;
    const { payment, UserStoreId, VariantId, quantity } = req.body;

    const variant = await sequelize.models.Variant.findByPk(VariantId);

    const amount = Number(variant.price * quantity);

    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: "RCT" + require("uid").uid(10).toUpperCase(),
    };

    const createOrder = async () => {
      try {
        console.log("entered in create order");

        const order = await sequelize.models.Order.create({
          order_id: order_id,
          price: amount,
          UserStoreId: UserStoreId,
          payment: payment,
          status: "new",
          address: "user address",
          isPaid: false,
        });

        console.log(order);
      } catch (error) {
        console.log(error);
        return error;
      }
    };

    const user = await sequelize.models.User_store.findByPk(2);

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        customer_details: {
          customer_id: "7112AAA812234",
          customer_phone: "9908734801",
          customer_email: user.email,
        },
        order_meta: {
          // return_url: `http://narayan.localhost:4500/api/order/cashfreeVerify?order_id=d1cdddbc-fcdb-4e84-a289-e5fe13b699d7`,
          return_url: `http://narayan.localhost:4500/api/order/cashfreeVerify?order_id=${order_id}`,
          // notify_url: "http://localhost:4500/api",
        },
        order_id: order_id,
        order_amount: amount,
        order_currency: "INR",
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        },
      }
    );

    const data = response.data;
    console.log(data);

    // Create a subscription
    await createOrder();

    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create Cashfree order" });
  }
};

exports.verifyCashfree = async (req, res) => {
  try {
    const sequelize = req.db;
    console.log("entered in verify cashfree");
    const orderId = req.query.order_id;
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
        },
      }
    );

    const result = response.data;
    if (result.order_status === "PAID") {
      const token =
        "dDQ53sEPIHr6Wu5TUvxX5M:APA91bHlYmCT6Veoukmk_AozLrtYRegqhtPZIVHYtz8OeclbTp9jTTCrjuR20orkmAOa9P1yGom4hvfpPgOoDWOsHMr-XHhaftEYUKHfvdzI6oWxwhJrwM_4TuhJAQdD31YPewmC8kiP";
      const message = {
        notification: {
          title: "Order Purchased successfullY!",
          body: "Your Order has been created successfully , now you can enjoy shopping",
        },
        token,
      };

      try {
        const order = await sequelize.models.Order.findOne({
          where: { order_id: orderId },
        });

        if (order) {
          await order.update({
            payment_id: result.cf_order_id,
            status: "ACTIVE",
          });

          console.log("Subscription updated successfully");
        } else {
          console.log("Subscription not found");
        }
      } catch (error) {
        console.error("Error creating payment log:", error);
        return res.status(500).send("Internal Server Error");
      }

      return res
        .status(200)
        .send({ message: "Transaction Successful!", data: result });
    } else {
      return res.status(400).send(
        requestError({
          message: "Bad Request!",
          details:
            "cashfree_signature and generated signature did not matched!",
        })
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to verify Cashfree payment" });
  }
};

exports.webhookCashfree = async (req, res, buf) => {
  try {
    console.log("entered in webhook cashfree");

    console.log(req.rawBody + "this is body");

    const sequelize = req.db;
    const ts = req.headers["x-webhook-timestamp"];
    const signature = req.headers["x-webhook-signature"];
    const currTs = Math.floor(new Date().getTime() / 1000);

    if (currTs - ts > 30000) {
      return res.status(400).send("Failed");
    }

    const genSignature = await verify(ts, req.rawBody);

    if (signature === genSignature) {
      console.log("signature is verified");
      const webHookBody = await getCashfreeWebhookBody(req);
      console.log(webHookBody + "this is webhookBody");
      const payment_log = await sequelize.models.Payment_log.create(
        webHookBody
      );
      console.log("Payment log created successfully with body" + webHookBody);

      return res.status(200).send("OK");
    } else {
      console.log("signature is not verified");
      return res.status(400).send("Failed");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    await order.update({ status: "accepted" });

    return res.status(200).send({
      message: "Order status updated to accepted successfully!",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    await order.update({ status: "cancelled" });

    return res.status(200).send({
      message: "Order status updated to cancelled successfully!",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
};

exports.getOrdersByStatus = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const status = req.params.status;

    // Find orders with the specified status
    const orders = await Order.findAll({
      where: { status: status },
    });

    return res.status(200).send({
      message: `Orders with status '${status}' retrieved successfully`,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to retrieve orders by status" });
  }
};

exports.deliverOrder = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const orderId = req.params.id;

    // Find the order by ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    // Update the order status to "delivered"
    await order.update({ status: "delivered" });

    return res.status(200).send({
      message: "Order marked as delivered successfully!",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to mark the order as delivered" });
  }
};
