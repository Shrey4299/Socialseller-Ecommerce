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

const handleWalletOrder = async (req, res) => {
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
  }
};

const createWalletVariantOrder = async (
  quantity,
  VariantId,
  OrderId,
  req,
  res
) => {
  try {
    console.log("entered in create order variant creation");
    console.log(OrderId);
    const sequelize = req.db;
    const variant = await sequelize.models.Variant.findByPk(VariantId);

    if (!variant) {
      return res.status(404).send({ error: "Variant not found" });
    }

    await variant.update({ quantity: variant.quantity - quantity });

    const orderVariant = await sequelize.models.Order_variant.create({
      quantity,
      price: variant.price * quantity,
      selling_price: variant.price * quantity,
      VariantId,
      status: "PROCESSING",
    });

    await sequelize.models.Order_variant_link.create({
      OrderVariantId: orderVariant.id,
      OrderId,
    });
  } catch (error) {
    console.error(error);
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

const updatePaymetLog = async (req, res) => {
  console.log("entered in update payment log");
  const sequelize = dbCache.get("main_instance");

  const webhookBody = {
    entity: "event",
    account_id: "acc_EqZnZU1YDmNcj0",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
      payment: {
        entity: {
          id: "pay_Mng2IqTQuvgIZ8",
          entity: "payment",
          amount: 20298,
          currency: "INR",
          status: "captured",
          order_id: "order_Mng23S5rfeQvfT",
          invoice_id: null,
          international: false,
          method: "wallet",
          amount_refunded: 0,
          refund_status: null,
          captured: true,
          description: "This is test Transactions",
          card_id: null,
          bank: null,
          wallet: "airtelmoney",
          vpa: null,
          email: "void@razorpay.com",
          contact: "+918349988146",
          notes: [],
          fee: 480,
          tax: 74,
          error_code: null,
          error_description: null,
          error_source: null,
          error_step: null,
          error_reason: null,
          acquirer_data: {
            transaction_id: null,
          },
          created_at: 1697197008,
          base_amount: 20298,
        },
      },
    },
    created_at: 1697197010,
  };

  const payload = webhookBody.payload;

  const Payment_log = await sequelize.models.Payment_log.create({
    order_id: payload.payment.entity.order_id,
    payment_id: payload.payment.entity.id,
    amount: payload.payment.entity.amount,
    amount_refunded: payload.payment.entity.amount_refunded,
    currency: payload.payment.entity.currency,
    status: payload.payment.entity.status,
    method: payload.payment.entity.method,
    card_id: payload.payment.entity.card_id,
    card: null,
    last4: null,
    network: null,
    bank: null,
    wallet: null,
    vpa: payload.payment.entity.vpa,
    email: payload.payment.entity.email,
    contact: payload.payment.entity.contact,
    notes: payload.payment.entity.contact,
  });
};

module.exports = {
  handleWalletOrder,
  createWalletVariantOrder,
  sendNotification,
  generateOrderId,
  generateTransactionId,
  
};
