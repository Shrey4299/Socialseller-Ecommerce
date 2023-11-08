const { getPagination, getMeta } = require("../../../services/pagination");

/**
 * Create a new Plan_metrics
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const body = req.body;
    const planMetrics = await sequelize.models.Plan_metrics.create({
      subscribers_count: body.subscribers_count,
      revenue_generated: body.revenue_generated,
      PlanId: body.PlanId,
    });
    return res
      .status(200)
      .send({
        message: "Plan_metrics created successfully!",
        data: planMetrics,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a Plan_metrics" });
  }
};

/**
 * Find all Plan_metrics
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const planMetrics = await sequelize.models.Plan_metrics.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });
    const meta = await getMeta(pagination, planMetrics.count);
    return res.status(200).send({ data: planMetrics.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch Plan_metrics" });
  }
};

/**
 * Find a specific Plan_metrics by ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const planMetrics = await sequelize.models.Plan_metrics.findByPk(id);
    if (!planMetrics) {
      return res
        .status(400)
        .send({ error: "Invalid Id to fetch Plan_metrics" });
    }
    return res.status(200).send(planMetrics);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch Plan_metrics" });
  }
};

/**
 * Update a Plan_metrics
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const getPlanMetrics = await sequelize.models.Plan_metrics.findByPk(id);
    if (getPlanMetrics) {
      const planMetrics = await sequelize.models.Plan_metrics.update(req.body, {
        where: { id },
        returning: true,
      });
      return res
        .status(200)
        .send({
          message: "Plan_metrics updated successfully!",
          data: planMetrics,
        });
    } else {
      return res
        .status(400)
        .send({
          error: "Invalid Plan_metrics ID",
          details: "Requested Plan_metrics Id Does not exists",
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch Plan_metrics" });
  }
};

/**
 * Delete a Plan_metrics
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const getPlanMetrics = await sequelize.models.Plan_metrics.findByPk(id);
    if (!getPlanMetrics) {
      return res.status(400).send({ error: "Invalid Plan_metrics ID" });
    }
    const planMetrics = await sequelize.models.Plan_metrics.destroy({
      where: { id },
    });
    return res
      .status(200)
      .send({ message: "Plan_metrics deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch Plan_metrics" });
  }
};
