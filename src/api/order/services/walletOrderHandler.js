const firebaseAdmin = require("firebase-admin");
const fs = require("fs");
const ejs = require("ejs");
const { sendOrderConfirmationEmail } = require("../../../services/emailSender");
const dbCache = require("../../../utils/dbCache");
const { requestError } = require("../../../services/errors");
const crypto = require("crypto");

const PRICE = 3000;

const sendNotification = async () => {
  console.log("entered in FCM");
  const token =
    "fJTTL0EVXZo6_tdNsUytRY:APA91bH5LstGlPSY_LQPfP8hFCDpIUmYF8o4Ct5qR1vgctcxYxTRfVscCRsjmscoOdSEuO8skY3MgKrQ7k5VBeRe-vgmvC9oXnPlP7Pc65UQTyoI0F5Vvd-vo5fa99lIDIFVNUd5WHI6";

  const message = {
    notification: {
      title: "Order is placed successfully!",
      body: "now you can enjoy your shopping",
    },
    token,
  };

  try {
    const sendMessage = await firebaseAdmin.messaging().send(message);
    console.log("Notification sent successfully:", sendMessage);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const handleWalletOrder = async (
  req,
  res,
  sequelize,
  totalAmount,
  transaction
) => {
  try {
    await sendNotification();

    const slug = "adfd-adff-adff";
    const name = "shreyansh";
    const discount = 10;
    const email = "shreyanshdewangan4299@gmail.com";

    const htmlContent = fs.readFileSync("./views/orderTemplate.ejs", "utf8");
    const renderedContent = ejs.render(htmlContent, {
      price: PRICE,
      slug,
      name,
      discount,
    });

    await sendOrderConfirmationEmail(email, renderedContent);
  } catch (error) {
    console.error(error);
    // Rollback the transaction in case of an error
    await transaction.rollback();
    res.status(500).send({ error: "Failed to handle wallet order" });
  }
};

const createWalletVariantOrder = async (
  quantity,
  VariantId,
  OrderId,
  req,
  { transaction, res }
) => {
  try {
    console.log("entered in create order variant creation");
    console.log(OrderId);
    const sequelize = req.db;
    const variant = await sequelize.models.Variant.findByPk(VariantId);

    if (!variant) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      return res.status(404).send({ error: "Variant not found" });
    }

    await variant.update(
      { quantity: variant.quantity - quantity },
      { transaction }
    );

    const orderVariant = await sequelize.models.Order_variant.create(
      {
        quantity,
        price: variant.price * quantity,
        selling_price: variant.price * quantity,
        VariantId,
        status: "PROCESSING",
      },
      { transaction }
    );

    await sequelize.models.Order_variant_link.create(
      {
        OrderVariantId: orderVariant.id,
        OrderId,
      },
      { transaction }
    );
  } catch (error) {
    console.error(error);
    // Rollback the transaction in case of an error
    await transaction.rollback();
  }
};

const updateProductMetrics = async (
  quantity,
  VariantId,
  OrderId,
  req,
  { transaction, res }
) => {
  try {
    console.log("entered in update product metrics");
    const sequelize = req.db;
    const variant = await sequelize.models.Variant.findByPk(VariantId);

    if (!variant) {
      await transaction.rollback();
      console.log("variant not found");
      return res.status(404).send({ error: "Variant not found" });
    }

    const product = await sequelize.models.Product.findByPk(variant.ProductId);
    if (!product) {
      await transaction.rollback();
      console.log("product not found");
      return res.status(404).send({ error: "Product not found" });
    }

    const existingProductMetrics =
      await sequelize.models.Product_metrics.findOne({
        ProductId: product.ProductId,
      });

    if (existingProductMetrics) {
      await existingProductMetrics.update(
        {
          view_count: existingProductMetrics.view_count + 1,
          ordered_count: existingProductMetrics.ordered_count + 1,
          shares_count: existingProductMetrics.shares_count + 1,
          revenue_generated:
            existingProductMetrics.revenue_generated + variant.price * quantity,
        },
        { transaction }
      );
    } else {
      // Change const to let for productMetrics to have broader scope
      let productMetrics = await sequelize.models.Product_metrics.create(
        {
          ProductId: product.id,
          view_count: 1,
          ordered_count: 1,
          shares_count: 1,
          revenue_generated: variant.price * quantity,
        },
        { transaction }
      );
      // Now you can use productMetrics outside of this block if needed
    }
  } catch (error) {
    console.error(error);
    // await transaction.rollback();
  }
};

const generateOrderId = () => {
  const order_id_prefix = "ORD";
  const order_id_length = 10;

  const generatedOrderId =
    order_id_prefix +
    crypto
      .randomBytes(order_id_length / 2)
      .toString("hex")
      .toUpperCase();

  return generatedOrderId;
};

const generateTransactionId = () => {
  const randomBytes = crypto.randomBytes(5);
  const transactionId = "WLT" + randomBytes.toString("hex").toUpperCase();
  return transactionId.substring(0, 13);
};

module.exports = {
  handleWalletOrder,
  createWalletVariantOrder,
  updateProductMetrics,
  sendNotification,
  generateOrderId,
  generateTransactionId,
};
