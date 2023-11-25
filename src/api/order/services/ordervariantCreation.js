const { requestError } = require("../../../services/errors");
const dbCache = require("../../../utils/dbCache");

exports.createVariantOrder = async (quantity, VariantId, OrderId, req, res) => {
  try {
    console.log("entered in create order variant creation");
    console.log(OrderId);
    const sequelize = req.db;
    const variant = await sequelize.models.Variant.findByPk(VariantId);

    const orderVariant = await sequelize.models.Order_variant.create({
      quantity: quantity,
      price: variant.price * quantity,
      selling_price: variant.price * quantity,
      VariantId: VariantId,
      status: "NEW",
    });

    const orderVariantLink = await sequelize.models.Order_variant_link.create({
      OrderVariantId: orderVariant.id,
      OrderId: OrderId,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.updateOrderVariant = async (OrderId, client) => {
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

    const order = await sequelize.models.Order.findOne({
      where: { order_id: OrderId },
    });

    const orderVariantLink = await sequelize.models.Order_variant_link.findOne({
      where: { OrderId: order.id },
    });

    if (!orderVariantLink) {
      console.error("Order_variant_link not found for OrderId:", OrderId);
    }

    await sequelize.models.Order_variant.update(
      { status: "PROCESSING" },
      { where: { id: orderVariantLink.OrderVariantId } }
    );

    console.log("Order_variant updated successfully");
  } catch (error) {
    console.error(error);
  }
};
