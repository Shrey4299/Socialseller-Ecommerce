const firebaseAdmin = require("firebase-admin");
const fs = require("fs");
const ejs = require("ejs");
const { sendOrderConfirmationEmail } = require("../../../services/emailSender");
const { createActivityLog } = require("./createActivityLog");

const dbCache = require("../../../utils/dbCache");
const { requestError } = require("../../../services/errors");

exports.handleSuccessfulOrder = async (
  client,
  razorpayOrderId,
  razorpayPaymentId,
  transaction,
  req,
  res,
) => {
  try {
    const OrderUpdate = await changeInOrderTable(
      client,
      razorpayOrderId,
      razorpayPaymentId,
      { transaction }
    );

    const orderVariantUpdate = await updateOrderVariant(
      razorpayOrderId,
      client,
      { transaction }
    );



    const callSendNotification = await sendNotification();

    const price = 3000;
    const slug = "adfd-adff-adff";
    const name = "shreyansh";
    const discount = 10;
    const email = "shreyanshdewangan4299@gmail.com";

    const htmlContent = fs.readFileSync("./views/orderTemplate.ejs", "utf8");
    const renderedContent = ejs.render(htmlContent, {
      price,
      slug,
      name,
      discount,
    });

    await sendOrderConfirmationEmail(email, renderedContent);
  } catch (error) {
    console.error(error);
  }
};

const changeInOrderTable = async (
  client,
  razorpayOrderId,
  razorpayPaymentId,
  transaction
) => {
  try {
    const subdomain = client;
    const sequelize = dbCache.get(subdomain);

    if (!sequelize) {
      throw requestError({
        message: "Invalid Site Address",
        details: "Requested subdomain not found",
      });
    }

    console.log("Entered in successful order");

    const order = await sequelize.models.Order.update(
      { isPaid: true, payment_id: razorpayPaymentId },
      { where: { payment_order_id: razorpayOrderId } },
      { transaction }
    );

    if (order) {
      return { success: true, message: "Order marked as successful!" };
    } else {
      throw requestError({
        message: "Bad Request!",
        details: "Failed to update order status",
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateOrderVariant = async (OrderId, client, transaction) => {
  try {
    console.log("Entered in update order variant creation");
    console.log(OrderId);

    const subdomain = client;
    const sequelize = dbCache.get(subdomain);

    if (!sequelize) {
      throw requestError({
        message: "Invalid Site Address",
        details: "Requested subdomain not found",
      });
    }

    const order = await sequelize.models.Order.findOne(
      {
        where: { payment_order_id: OrderId },
      },
      { transaction }
    );

    const orderVariantLinks = await sequelize.models.Order_variant_link.findAll(
      {
        where: { OrderId: order.id },
      },
      { transaction }
    );

    if (!orderVariantLinks || orderVariantLinks.length === 0) {
      throw requestError({
        message: "Order_variant_links not found for OrderId",
        details: OrderId,
      });
    }

    await Promise.all(
      orderVariantLinks.map(async (orderVariantLink) => {
        await sequelize.models.Order_variant.update(
          { status: "PROCESSING" },
          { where: { id: orderVariantLink.OrderVariantId } },
          { transaction }
        );
      })
    );

    console.log("Order_variant updated successfully");
  } catch (error) {
    console.error(error);
  }
};

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
