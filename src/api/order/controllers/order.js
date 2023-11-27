const { requestError } = require("../../../services/errors");
const { razorpay } = require("../../../utils/gateway");
const crypto = require("crypto");
const getWebhookBody = require("../services/getWebhookBody");
const uuid = require("uuid");
const axios = require("axios");
const getCashfreeWebhookBody = require("../services/getCashfreeWebhookBody");
const productMetricsService = require("../../../services/productMetricsUpdate");
const { handleSuccessfulOrder } = require("../services/orderHandler");
const orederVariantCreation = require("../services/ordervariantCreation.js");

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
    console.log("Entered in razorpay checkout");
    const sequelize = req.db;
    const client = req.hostname.split(".")[0];
    console.log(client + " this is client");

    const { payment, UserStoreId, variantQuantities, AddressId } = req.body;

    if (!variantQuantities || !Array.isArray(variantQuantities)) {
      return res
        .status(400)
        .json({ error: "Invalid variantQuantities in the request body" });
    }

    const variants = await sequelize.models.Variant.findAll();

    const totalAmount = variantQuantities.reduce(
      (sum, { VariantId, quantity }) => {
        const variant = variants.find((v) => v.id === VariantId);
        return sum + variant.price * quantity;
      },
      0
    );

    console.log(totalAmount + " this is total amount");

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: "RCT" + require("uid").uid(10).toUpperCase(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    await orederVariantCreation.createOrder(
      razorpayOrder,
      variants,
      UserStoreId,
      AddressId,
      payment,
      variantQuantities,
      req
    );

    const orderWithClient = { ...razorpayOrder, client };
    res.status(200).send(orderWithClient);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch subscription" });
  }
};

exports.verify = async (req, res) => {
  try {
    console.error("Entered in razorpay verify");
    console.info(`${req.body.client} - This is the client in verify`);

    const {
      client,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    const sequelize = req.db;

    console.log(razorpay_order_id + razorpay_payment_id);
    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

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

    const orderVariantLinks = await sequelize.models.Order_variant_link.findAll(
      {
        where: { OrderId: order.id },
      }
    );

    if (!orderVariantLinks || orderVariantLinks.length === 0) {
      throw requestError({
        message: "Order_variant_links not found for OrderId",
      });
    }

    await Promise.all(
      orderVariantLinks.map(async (orderVariantLink) => {
        await sequelize.models.Order_variant.update(
          { status: "ACCEPTED" },
          { where: { id: orderVariantLink.OrderVariantId } }
        );
      })
    );

    return res.status(201).send({ message: "order is accepted" });
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

    const orderVariantLinks = await sequelize.models.Order_variant_link.findAll(
      {
        where: { OrderId: order.id },
      }
    );

    if (!orderVariantLinks || orderVariantLinks.length === 0) {
      throw requestError({
        message: "Order_variant_links not found for OrderId",
      });
    }

    await Promise.all(
      orderVariantLinks.map(async (orderVariantLink) => {
        await sequelize.models.Order_variant.update(
          { status: "CANCELLED" },
          { where: { id: orderVariantLink.OrderVariantId } }
        );
      })
    );

    return res.status(201).send({ message: "order is cancelled" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the order status" });
  }
};

exports.deliverOrder = async (req, res) => {
  try {
    const sequelize = req.db;
    const Order = sequelize.models.Order;
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    const orderVariantLinks = await sequelize.models.Order_variant_link.findAll(
      {
        where: { OrderId: order.id },
      }
    );

    if (!orderVariantLinks || orderVariantLinks.length === 0) {
      throw requestError({
        message: "Order_variant_links not found for OrderId",
      });
    }

    await Promise.all(
      orderVariantLinks.map(async (orderVariantLink) => {
        await sequelize.models.Order_variant.update(
          { status: "DELIVERED" },
          { where: { id: orderVariantLink.OrderVariantId } }
        );
      })
    );

    return res.status(201).send({ message: "order is delivered" });
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
