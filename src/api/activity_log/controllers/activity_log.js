exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const activity_log = await sequelize.models.Activity_log.create(req.body);
    return res
      .status(200)
      .send({
        message: "Activity Log Created Successfully!",
        data: activity_log,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create an activity log" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const logId = req.params.id;
    const [updatedRowsCount, updatedLog] =
      await sequelize.models.Activity_log.update(req.body, {
        where: { id: logId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Activity Log not found" });
    }
    return res
      .status(200)
      .send({
        message: "Activity Log Updated Successfully!",
        data: updatedLog[0],
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the activity log" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;
    const logs = await sequelize.models.Activity_log.findAll();
    return res.status(200).send(logs);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch activity logs" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const logId = req.params.id;
    const log = await sequelize.models.Activity_log.findOne({
      where: { id: logId },
    });
    if (!log) {
      return res.status(404).send({ error: "Activity Log not found" });
    }
    return res.status(200).send(log);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the activity log" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const logId = req.params.id;
    const deletedRowCount = await sequelize.models.Activity_log.destroy({
      where: { id: logId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Activity Log not found" });
    }
    return res
      .status(200)
      .send({ message: "Activity Log Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the activity log" });
  }
};
