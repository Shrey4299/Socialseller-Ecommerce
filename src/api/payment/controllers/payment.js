const sequelize = require("../../../../server").sequelize; // Import the Sequelize instance
const { getPagination, getMeta } = require("../../../services/pagination");
const dbConfig = require("../../../../config/db.config"); // Assuming your payment model is defined in ../models/payment.js

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;

    const paymentData = {
      account_id: req.body.account_id,
      amount: req.body.amount,
      currency: req.body.currency,
      status: req.body.status,
      order_id: req.body.order_id,
      method: req.body.method,
      description: req.body.description,
      card_id: req.body.card_id,
      card: req.body.card,
      bank: req.body.bank,
      wallet: req.body.wallet,
      vpa: req.body.vpa,
      email: req.body.email,
      contact: req.body.contact,
      error_code: req.body.error_code,
      error_description: req.body.error_description,
      acquirer_data: req.body.acquirer_data,
      upi: req.body.upi,
      base_amount: req.body.base_amount,
    };

    const payment = await sequelize.models.Payment.create(paymentData);

    return res.status(200).send({
      message: "Payment created successfully!",
      response: payment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a payment" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const query = req.query;
    const pagination = await getPagination(query.pagination);

    const payments = await sequelize.models.Payment.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      distinct: true,
    });
    const meta = await getMeta(pagination, payments.count);
    return res.status(200).send({ data: payments.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch payments" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.findOne = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const sequelize = req.db;

    const payment = await sequelize.models.Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).send({ error: "Payment not found" });
    }

    return res
      .status(200)
      .send({ payment, message: "Payment Retrieved Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to retrieve the payment" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.update = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const updatedPaymentData = req.body;
    const sequelize = req.db;

    const existingPayment = await sequelize.models.Payment.findByPk(paymentId);

    if (!existingPayment) {
      return res.status(404).send({ error: "Payment not found" });
    }

    await existingPayment.update(updatedPaymentData);

    return res.status(200).send({
      payment: existingPayment,
      message: "Payment Updated Successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the payment" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.delete = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const sequelize = req.db;

    const existingPayment = await sequelize.models.Payment.findByPk(paymentId);

    if (!existingPayment) {
      return res.status(404).send({ error: "Payment not found" });
    }

    await existingPayment.destroy();

    return res.status(200).send({ message: "Payment Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the payment" });
  }
};
