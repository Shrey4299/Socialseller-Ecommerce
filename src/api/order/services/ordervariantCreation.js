const crypto = require("crypto");
const jwt = require("../../../services/jwt");
const { tokenError, requestError } = require("../../../services/errors");
const dbCache = require("../../../utils/dbCache");

const createVariantOrder = async (quantity, VariantId, OrderId, req, t) => {
  try {
    console.log("entered in create order variant creation");
    console.log(OrderId);
    const sequelize = req.db;
    const variant = await sequelize.models.Variant.findByPk(VariantId);

    if (!variant) {
      return res.status(404).send({ error: "Variant not found" });
    }

    await variant.update(
      { quantity: variant.quantity - quantity },
      { transaction: t }
    );

    const orderVariant = await sequelize.models.Order_variant.create(
      {
        quantity: quantity,
        price: variant.price * quantity,
        selling_price: variant.price * quantity,
        VariantId: VariantId,
        status: "NEW",
      },
      { transaction: t }
    );

    const orderVariantLink = await sequelize.models.Order_variant_link.create(
      {
        OrderVariantId: orderVariant.id,
        OrderId: OrderId,
      },
      { transaction: t }
    );
  } catch (error) {
    console.error(error);
  }
};

const updateProductMetrics = async (quantity, VariantId, req, t) => {
  try {
    console.log("entered in update product metrics");
    const sequelize = req.db;
    const variant = await sequelize.models.Variant.findByPk(VariantId);

    if (!variant) {
      console.log("variant not found");
      return res.status(404).send({ error: "Variant not found" });
    }

    const product = await sequelize.models.Product.findByPk(variant.ProductId);
    if (!product) {
      console.log("product not found");
      return res.status(404).send({ error: "Product not found" });
    }

    const existingProductMetrics =
      await sequelize.models.Product_metrics.findOne({
        ProductId: product.ProductId,
      });

    if (existingProductMetrics) {
      await existingProductMetrics.update(
        {
          view_count: existingProductMetrics.view_count + 1,
          ordered_count: existingProductMetrics.ordered_count + 1,
          shares_count: existingProductMetrics.shares_count + 1,
          revenue_generated:
            existingProductMetrics.revenue_generated + variant.price * quantity,
        },
        { transaction: t }
      );
    } else {
      // Change const to let for productMetrics to have broader scope
      let productMetrics = await sequelize.models.Product_metrics.create(
        {
          ProductId: product.id,
          view_count: 1,
          ordered_count: 1,
          shares_count: 1,
          revenue_generated: variant.price * quantity,
        },
        { transaction: t }
      );
      // Now you can use productMetrics outside of this block if needed
    }
  } catch (error) {
    console.error(error);
    // await transaction.rollback();
  }
};

exports.createOrder = async (
  razorpayOrder,
  variants,
  UserStoreId,
  AddressId,
  payment,
  variantQuantities,
  req,
  t
) => {
  try {
    const sequelize = req.db;

    const orderProduct = await sequelize.models.Order.create(
      {
        order_id: generateOrderId(),
        payment_order_id: razorpayOrder.id,
        price: razorpayOrder.amount / 100,
        UserStoreId: UserStoreId,
        payment: payment,
        status: "new",
        AddressId: AddressId,
        isPaid: false,
      },
      { transaction: t } // Use the provided transaction if available
    );

    await Promise.all(
      variantQuantities.map(async ({ VariantId, quantity }) => {
        const variant = variants.find((v) => v.id === VariantId);
        await createVariantOrder(quantity, VariantId, orderProduct.id, req, t);

        await updateProductMetrics(quantity, VariantId, req,t);
      })
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getUserId = async (req, res) => {
  const sequelize = req.db;
  const token = jwt.verify(req);
  if (token.error) {
    return res.status(401).send(tokenError(token));
  }
  const findUser = await sequelize.models.User_store.findByPk(token.id);

  if (!findUser) {
    return res.status(400).send(
      requestError({
        message: "Invalid Data!",
        details: "Invalid payload data found in token!",
      })
    );
  }

  console.log(findUser.id + "this is user id");
  return findUser.id;
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
