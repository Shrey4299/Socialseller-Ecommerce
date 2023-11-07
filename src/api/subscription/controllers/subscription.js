const { uid } = require("uid");
const uuid = require("uuid");
const { getDate, getValidToDates } = require("../services/subscription");
const { Op, or } = require("sequelize");
const jwt = require("../../../services/jwt");
const crypto = require("crypto");
const { getPagination, getMeta } = require("../../../services/pagination");
const axios = require("axios");
const firebaseAdmin = require("firebase-admin");
var serviceAccount = require("../../../../config/web-push-559b6-firebase-adminsdk-8ruqy-5670e6b148.json");
const getWebhookBody = require("../services/getWebhookBody");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const payment_log = require("../../payment_log/models/payment_log");
const orderBy = require("../../../services/orderBy");
const { requestError } = require("../../../services/errors");
const { razorpay } = require("../../../utils/gateway");

const verify = require("../services/cashfreeSignatureVerify");
const getCashfreeWebhookBody = require("../services/getCashfreeWebhookBody");
const { token } = require("morgan");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    console.log("inside creat subs");
    const sequelize = req.db;
    const body = req.body;
    const valid_from = getDate();

    const valid_to = getValidToDates(10);
    console.log(valid_from, valid_to);
    const subscription = await sequelize.models.Subscription.create({
      order_id: `OID_${uid(10)}`,
      payment_id: `PID_${uid(10)}`,
      order_type: body.order_type,
      valid_from: valid_from,
      valid_to: valid_to,
      PlanId: body.plan_id,
      purchaseType: "CASH",
    });
    return res.status(200).send(subscription);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a subscription" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const query = req.query;
    const { tag, mode } = query;
    const order = orderBy(query);
    let subscriptions;
    const pagination = await getPagination(query.pagination);

    switch (mode) {
      case "online":
        console.log("online");
        subscriptions = await sequelize.models.Subscription.findAndCountAll({
          where: [{ is_paid: tag }, { purchaseType: "ONLINE" }],
          limit: pagination.limit,
          offset: pagination.offset,
          order: order,
        });
        break;
      case "cash":
        console.log("cash");
        subscriptions = await sequelize.models.Subscription.findAndCountAll({
          where: [{ is_paid: tag }, { purchaseType: "CASH" }],
          limit: pagination.limit,
          offset: pagination.offset,
          order: order,
        });
        break;
      case "all":
        console.log("all");
        subscriptions = await sequelize.models.Subscription.findAndCountAll({
          where: { is_paid: tag },
          limit: pagination.limit,
          offset: pagination.offset,
          order: order,
        });
        break;
      default:
        break;
    }

    const meta = await getMeta(pagination, subscriptions?.count);

    return res.status(200).send({ data: subscriptions?.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch subscriptions" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const subscription = await sequelize.models.Subscription.findByPk(id, {
      include: { model: sequelize.models.Plan, as: "plan" },
    });
    if (!subscription)
      return res
        .status(400)
        .send(requestError({ message: "Invalid Subscription ID" }));
    return res.status(200).send(subscription);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch subscription" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const getsubscription = await sequelize.models.Subscription.findByPk(id);

    if (!getsubscription)
      return res
        .status(400)
        .send(requestError({ message: "Invalid Subscription ID" }));
    const subscription = await sequelize.models.Subscription.update(req.body, {
      where: { id },
      returning: true,
    });
    return res.status(200).send({
      message: "subscription updated successfully!",
      data: subscription[1][0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch subscription" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const getsubscription = await sequelize.models.Subscription.findByPk(id);

    if (!getsubscription)
      return res
        .status(400)
        .send(requestError({ message: "Invalid ID to delete" }));
    const subscription = await sequelize.models.Subscription.destroy({
      where: { id },
    });
    return res
      .status(200)
      .send({ message: "subscription deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch subscription" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.checkOut = async (req, res) => {
  try {
    const sequelize = req.db;
    const plan_id = req.body.plan_id;
    const body = req.body;
    const plan = await sequelize.models.Plan.findByPk(plan_id);

    const amount = Number((plan.price / 100) * 2) + Number(plan.price);

    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: "RCT" + require("uid").uid(10).toUpperCase(),
    };

    const createSubscription = async (order) => {
      try {
        const valid_from = getDate();
        const valid_to = getValidToDates(plan.validity);
        const token = jwt.verify(req);
        const subscription = await sequelize.models.Subscription.create({
          order_id: order.id,
          order_type: body.order_type,
          valid_from: valid_from,
          valid_to: valid_to,
          PlanId: body.plan_id,
          purchaseType: "ONLINE",
          UserId: token.id,
        });
      } catch (error) {
        console.log(error);
        return error;
      }
    };

    const prePaidSubscription = razorpay.orders.create(
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
        await createSubscription(order);
        return res.status(200).send(order);
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch subscription" });
  }
};

exports.verify = async (req, res) => {
  try {
    const sequelize = req.db;
    const token = jwt.verify(req);
    const body = req.body;
    const { razorpay_signature, razorpay_payment_id, razorpay_order_id } = body;
    const razorpay_OP_id = razorpay_order_id + "|" + razorpay_payment_id;
    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_OP_id.toString())
      .digest("hex");

    if (generateSignature === razorpay_signature) {
      console.log("signature verified!");
      const subscription = await sequelize.models.Subscription.update(
        { is_paid: true, payment_id: razorpay_payment_id, status: "ACTIVE" },
        { where: { order_id: razorpay_order_id } }
      );
      if (subscription) {
        const token =
          "dDQ53sEPIHr6Wu5TUvxX5M:APA91bHlYmCT6Veoukmk_AozLrtYRegqhtPZIVHYtz8OeclbTp9jTTCrjuR20orkmAOa9P1yGom4hvfpPgOoDWOsHMr-XHhaftEYUKHfvdzI6oWxwhJrwM_4TuhJAQdD31YPewmC8kiP";
        const message = {
          notification: {
            title: "Subscription Purchased successfullY!",
            body: "Your subscription has been created successfully , now you can enjoy premium benifits",
          },
          token,
        };

        const sendMessage = await firebaseAdmin.messaging().send(message);
        console.log(sendMessage);
        return res
          .status(200)
          .send({ message: "Transaction Successful!", data: subscription });
      } else {
        return res.status(400).send(
          requestError({
            message: "Bad Request!",
            details: "we could not updated subscription",
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

exports.webhook = async (req, res) => {
  try {
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
    const payment_log = sequelize.models.Payment_log.create(webHookBody);
    return res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.refund = async (req, res) => {
  try {
    const subscription = req.body.subscription;
    console.log(subscription);
    const refund = await razorpay.payments.refund(subscription.payment_id, {
      amount: subscription.plan.price * 100,
      speed: "normal",
    });
    if (refund) {
      const updateSubsciption = await sequelize.models.Subscription.update(
        { status: "REFUNDED" },
        { where: { id: subscription.id } }
      );
    }
    return res
      .status(200)
      .send({ message: "Refund Is Created", data: refund, subscription });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.createCashfreeOrder = async (req, res) => {
  try {
    const order_id = uuid.v4();
    const sequelize = req.db;
    const plan_id = req.body.plan_id;
    const body = req.body;
    const plan = await sequelize.models.Plan.findByPk(plan_id);

    const amount = Number((plan.price / 100) * 2) + Number(plan.price);

    const createSubscription = async () => {
      try {
        console.log("entered in create subscription");

        const valid_from = getDate();
        const valid_to = getValidToDates(plan.validity);
        const token = jwt.verify(req);

        console.log("this is token" + token);
        const subscription = await sequelize.models.Subscription.create({
          order_id: order_id,
          valid_from: valid_from,
          valid_to: valid_to,
          PlanId: body.plan_id,
          purchaseType: "ONLINE",
          UserId: token.id,
        });

        // Log the created subscription for verification
        console.log(subscription);
      } catch (error) {
        console.log(error);
        return error;
      }
    };

    const user = await sequelize.models.User.findByPk(1);

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        customer_details: {
          customer_id: "7112AAA812234",
          customer_phone: "9908734801",
          customer_email: user.email,
        },
        order_meta: {
          return_url: `http://localhost:4500/api/subscriptions/cashfreeVerify?order_id=${order_id}`,
          notify_url: "http://localhost:4500/api",
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
    await createSubscription();

    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create Cashfree order" });
  }
};

exports.verifyCashfree = async (req, res) => {
  try {
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
          title: "Subscription Purchased successfullY!",
          body: "Your subscription has been created successfully , now you can enjoy premium benifits",
        },
        token,
      };

      const sendMessage = await firebaseAdmin.messaging().send(message);
      console.log(sendMessage);
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

    console.log(genSignature + "this is genSignature");
    console.log(signature + "this is Signature");

    if (signature === genSignature) {
      console.log("signature is verified");
      const webHookBody = await getCashfreeWebhookBody(req);
      const payment_log = await sequelize.models.Payment_log.create(
        webHookBody
      );
      console.log("Payment log created successfully with body" + webHookBody);

      try {
        const subscription = await sequelize.models.Subscription.findOne({
          where: { order_id: webHookBody.order_id }, // Assuming you can identify the subscription by order_id
        });

        if (subscription) {
          // Update the payment_id and status
          await subscription.update({
            payment_id: webHookBody.payment_id,
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
