// Import necessary modules and services
const { Op, literal, or } = require("sequelize");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const body = req.body;

    // Create product metrics
    const productMetrics = await sequelize.models.Product_metrics.create({
      view_count: body.view_count,
      ordered_count: body.ordered_count,
      shares_count: body.shares_count,
      revenue_generated: body.revenue_generated,
    });

    return res.status(200).send({
      message: "Product metrics created successfully!",
      data: productMetrics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create product metrics" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;

    const productMetrics = await sequelize.models.Product_metrics.findAll();

    return res.status(200).send({ data: productMetrics });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch product metrics" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;

    const productMetrics = await sequelize.models.Product_metrics.findByPk(id);

    if (!productMetrics) {
      return res.status(404).send({ error: "Product metrics not found" });
    }

    return res.status(200).send({ data: productMetrics });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch product metrics" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const body = req.body;

    const productMetrics = await sequelize.models.Product_metrics.findByPk(id);

    if (!productMetrics) {
      return res.status(404).send({ error: "Product metrics not found" });
    }

    // Update product metrics
    await productMetrics.update({
      view_count: body.view_count,
      ordered_count: body.ordered_count,
      shares_count: body.shares_count,
      revenue_generated: body.revenue_generated,
      profit_margin: body.profit_margin,
      premium_plan_orders: body.premium_plan_orders,
    });

    return res.status(200).send({
      message: "Product metrics updated successfully!",
      data: productMetrics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update product metrics" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;

    const productMetrics = await sequelize.models.Product_metrics.findByPk(id);

    if (!productMetrics) {
      return res.status(404).send({ error: "Product metrics not found" });
    }

    // Delete product metrics
    await productMetrics.destroy();

    return res
      .status(200)
      .send({ message: "Product metrics deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete product metrics" });
  }
};
