// middlewares/database.js
const { requestError } = require("../../../services/errors");
const createDbConnection = require("../../../utils/dbConnection");
const dbCache = require("../../../utils/dbCache");

module.exports = async (client, razorpay_order_id, razorpay_payment_id) => {
  const subdomain = client;
  const sequelize = dbCache.get(subdomain);

  if (!sequelize) {
    throw requestError({
      message: "Invalid Site Address",
      details: "Requested subdomain not found",
    });
  }

  console.log("entered in successful order");

  const order = await sequelize.models.Order.update(
    { is_paid: true, payment_id: razorpay_payment_id, status: "ACTIVE" },
    { where: { order_id: razorpay_order_id } }
  );

  if (order) {
    return { message: "Order marked as successful!" };
  } else {
    throw requestError({
      message: "Bad Request!",
      details: "Failed to update order status",
    });
  }
};
