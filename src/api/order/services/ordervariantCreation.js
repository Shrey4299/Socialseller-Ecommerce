const order_variant = require("../../order_variant/routes/order_variant");

exports.createVariantOrder = async (quantity, VariantId, OrderId, req) => {
  try {
    console.log("entered in create order variant creation");
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;
    const variant = await sequelize.models.Variant.findOne({
      where: { id: VariantId },
    });

    const order = await sequelize.models.Order.findOne({
      where: { id: OrderId },
    });

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
        selling_price: variant.price * quantity,
        OrderId: OrderId,
        VariantId: VariantId,
        status: "new",
      });

      res.status(201).send({
        data: orderVariant,
        message: "Order Variant created/updated successfully",
      });
    }

    res.status(201).send({
      data: existingOrderVariant,
      message: "Order Variant created/updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
