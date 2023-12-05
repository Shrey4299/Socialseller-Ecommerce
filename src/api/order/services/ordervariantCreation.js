const crypto = require("crypto");

exports.createVariantOrder = async (quantity, VariantId, OrderId, req, res) => {
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

exports.createOrder = async (
  razorpayOrder,
  variants,
  UserStoreId,
  AddressId,
  payment,
  variantQuantities,
  req
) => {
  try {
    const sequelize = req.db;

    const orderProduct = await sequelize.models.Order.create({
      order_id: generateOrderId(),
      payment_order_id: razorpayOrder.id,
      price: razorpayOrder.amount / 100,
      UserStoreId: UserStoreId,
      payment: payment,
      status: "new",
      AddressId: AddressId,
      isPaid: false,
    });

    await Promise.all(
      variantQuantities.map(async ({ VariantId, quantity }) => {
        const variant = variants.find((v) => v.id === VariantId);
        await exports.createVariantOrder(
          quantity,
          VariantId,
          orderProduct.id,
          req
        );
      })
    );
  } catch (error) {
    console.log(error);
    throw error;
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
