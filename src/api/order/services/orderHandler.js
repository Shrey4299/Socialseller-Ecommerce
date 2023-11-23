// orderHandler.js
const firebaseAdmin = require("firebase-admin");
const fs = require("fs");
const ejs = require("ejs");
const { sendOrderConfirmationEmail } = require("../../../services/emailSender");
const successfullOrder = require("./successfullOrder");

exports.handleSuccessfulOrder = async (
  client,
  razorpayOrderId,
  razorpayPaymentId
) => {
  const result = await successfullOrder(
    client,
    razorpayOrderId,
    razorpayPaymentId
  );

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
};
