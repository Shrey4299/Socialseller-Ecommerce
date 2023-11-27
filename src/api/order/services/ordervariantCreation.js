const crypto = require("crypto");

exports.getOrderData = async (
  couponCode,
  VariantId,
  quantity,
  UserId,
  payment
) => {
  const discount = await db.discounts.findOne({
    where: { name: couponCode },
  });

  const variant = await db.variants.findByPk(VariantId);

  const finalPrice = discount
    ? variant.price * quantity - discount.discountPercentage
    : variant.price * quantity;

  const address = await db.address.findOne({
    where: { UserId: UserId },
  });

  const orderData = {
    price: finalPrice,
    UserId: UserId,
    payment: payment,
    status: "new",
    address: address.id,
    isPaid: false,
  };

  return orderData;
};

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
