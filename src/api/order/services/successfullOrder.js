const { requestError } = require("../../../services/errors");
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

  const variant = await sequelize.models.Variant.findByPk(2);

  if (!variant) {
    return res
      .status(404)
      .json({ success: false, message: "Variant not found" });
  }

  let variantQuantity = variant.quantity;

  await variant.update({
    quantity: variantQuantity - 1,
  });

  const order = await sequelize.models.Order.update(
    { isPaid: true, payment_id: razorpay_payment_id, status: "pending" },
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
