const { requestError } = require("../../../services/errors");
const { razorpay } = require("../../../utils/gateway");
const crypto = require("crypto");

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
    const orders = await Order.findAll();
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
    const orderId = req.params.id;
    const order = await Order.findOne({ where: { id: orderId } });

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

exports.createVariantOrder = async (req, res) => {
  try {
    const { quantity, VariantId, OrderId } = req.body;
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant; // Assuming this is the correct way to access the Order_variant model

    // Find the variant
    const variant = await sequelize.models.Variant.findOne({
      where: { id: VariantId },
    });

    // Find the order
    const order = await sequelize.models.Order.findOne({
      where: { id: OrderId },
    });

    // Check if the variant is already in the order
    const existingOrderVariant = await OrderVariant.findOne({
      where: {
        VariantId: VariantId,
        OrderId: OrderId,
      },
    });

    if (existingOrderVariant) {
      const newQuantity = existingOrderVariant.quantity + quantity;
      await existingOrderVariant.update({ quantity: newQuantity });
    } else {
      const orderVariant = await OrderVariant.create({
        quantity: quantity,
        price: variant.price * quantity,
        OrderId: OrderId,
        VariantId: VariantId,
      });
    }

    const orderVariants = await OrderVariant.findAll({
      where: { OrderId: OrderId },
    });

    const newPrice = orderVariants.reduce(
      (totalPrice, orderVariant) => totalPrice + orderVariant.price,
      0
    );

    await order.update({ price: newPrice });

    res
      .status(201)
      .send({ message: "Order Variant created/updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.checkOut = async (req, res) => {
  try {
    console.log("entered in razorpay checkout");
    const sequelize = req.db;
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
        return res.status(200).send(order);
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
      } catch (error) {
        console.log(error);
        return error;
      }
    };
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch subscription" });
  }
};

exports.verify = async (req, res) => {
  try {
    console.log("entered in razorpay verify");
    console.log(process.env.RAZORPAY_KEY_SECRET);
    const sequelize = req.db;
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
      console.log("signature verified!");
      const order = await sequelize.models.Order.update(
        { is_paid: true, payment_id: razorpay_payment_id, status: "ACTIVE" },
        { where: { order_id: razorpay_order_id } }
      );
      if (order) {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzAwMDQ1ODI4LCJleHAiOjE3MDA2NTA2Mjh9.xSqEWq2mLmUJb8uG2tWUEfsFkoY6bX7GHxMWZU4Zzww";
        const message = {
          notification: {
            title: "Order Purchased successfullY!",
            body: "Your Order has been created successfully , now you can enjoy shopping",
          },
          token,
        };

        return res
          .status(200)
          .send({ message: "Transaction Successful!", data: order });
      } else {
        return res.status(400).send(
          requestError({
            message: "Bad Request!",
            details: "we could not updated order",
          })
        );
      }
    } else {
      return res.status(400).send(
        requestError({
          message: "Bad Request!",
          details:
            "razorpay_signature and generated signature did not matched!",
        })
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
