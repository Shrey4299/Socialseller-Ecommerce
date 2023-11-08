// controllers/user_metricsController.js
const { getPagination, getMeta } = require("../../../services/pagination");

exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const body = req.body;

    const userMetrics = await sequelize.models.User_metrics.create(body);

    return res.status(200).send({
      message: "User Metrics Created Successfully!",
      data: userMetrics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create user metrics" });
  }
};

exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const query = req.query;

    const pagination = await getPagination(query.pagination);
    const userMetrics = await sequelize.models.User_metrics.findAll({
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, userMetrics.count);

    return res.status(200).send({ data: userMetrics.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch user metrics" });
  }
};

exports.findOne = async (req, res) => {
  try {
    console.log(req);
    const sequelize = req.db;
    const { id } = req.params;

    const userMetrics = await sequelize.models.User_metrics.findByPk(id);

    if (!userMetrics) {
      return res.status(404).send({ error: "User Metrics not found" });
    }

    return res.status(200).send(userMetrics);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch user metrics" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;

    const getUserMetrics = await sequelize.models.User_metrics.findByPk(id);

    if (!getUserMetrics) {
      return res.status(404).send({ error: "User Metrics not found" });
    }

    const userMetrics = await getUserMetrics.update(req.body);

    return res.status(200).send({
      message: "User Metrics Updated Successfully!",
      data: userMetrics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update user metrics" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;

    const getUserMetrics = await sequelize.models.User_metrics.findByPk(id);

    if (!getUserMetrics) {
      return res.status(404).send({ error: "User Metrics not found" });
    }

    await getUserMetrics.destroy();

    return res
      .status(200)
      .send({ message: "User Metrics Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete user metrics" });
  }
};
