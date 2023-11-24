// ordersController.js

exports.createOrderVariant = async (req, res) => {
  try {
    console.log("entered in create order variant");
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;

    const createdOrderVariant = await OrderVariant.create(req.body);

    return res.status(201).send({
      message: "Order variant created successfully!",
      data: createdOrderVariant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create order variant" });
  }
};

// ordersController.js

exports.getAllOrderVariants = async (req, res) => {
  try {
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;

    // Find all order variants
    const orderVariants = await OrderVariant.findAll();

    return res.status(200).send({
      message: "All order variants retrieved successfully",
      data: orderVariants,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to retrieve order variants" });
  }
};

exports.getOrderVariant = async (req, res) => {
  try {
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;
    const orderVariantId = req.params.id;

    console.log(orderVariantId);

    const orderVariant = await OrderVariant.findByPk(orderVariantId);

    if (!orderVariant) {
      return res.status(404).send({ error: "Order variant not found" });
    }

    return res.status(200).send({
      message: "Order variant retrieved successfully",
      data: orderVariant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to retrieve order variant" });
  }
};

exports.updateOrderVariant = async (req, res) => {
  try {
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;
    const orderVariantId = req.params.id;

    const [updatedRowsCount, updatedOrderVariant] = await OrderVariant.update(
      req.body,
      {
        where: { id: orderVariantId },
        returning: true,
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Order variant not found" });
    }

    return res.status(200).send({
      message: "Order variant updated successfully!",
      data: updatedOrderVariant[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update order variant" });
  }
};

exports.deleteOrderVariant = async (req, res) => {
  try {
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;
    const orderVariantId = req.params.id;

    const deletedRowCount = await OrderVariant.destroy({
      where: { id: orderVariantId },
    });

    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Order variant not found" });
    }

    return res.status(200).send({
      message: "Order variant deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete order variant" });
  }
};

// ordersController.js

exports.getAllOrderVariantsByOrderId = async (req, res) => {
  try {
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;
    const orderId = req.params.id;

    const orderVariants = await OrderVariant.findAll({
      where: { OrderId: orderId },
    });

    return res.status(200).send({
      message: `All order variants for OrderId ${orderId} retrieved successfully`,
      data: orderVariants,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to retrieve order variants" });
  }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const sequelize = req.db;
    const OrderVariant = sequelize.models.Order_variant;
    const orderId = req.params.orderId;
    const variantId = req.params.variantId;

    const orderVariant = await OrderVariant.findOne({
      where: { OrderId: orderId, VariantId: variantId },
    });

    if (!orderVariant) {
      return res.status(404).send({ error: "Order variant not found" });
    }

    await orderVariant.update({ status: "RETURN_REQUEST" });

    return res.status(200).send({
      message: "Return status updated successfully!",
      data: orderVariant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update return status" });
  }
};
