exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const { name, url } = req.body;

    const group = await sequelize.models.Group.create({ name, url });

    return res.status(201).send({
      message: "Group created successfully!",
      data: group,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a group" });
  }
};

exports.find = async (req, res) => {
  try {
    const sequelize = req.db;

    const groups = await sequelize.models.Group.findAll();

    return res.status(200).send(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch groups" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;

    const group = await sequelize.models.Group.findByPk(id);

    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }

    return res.status(200).send(group);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch group" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;

    const group = await sequelize.models.Group.findByPk(id);

    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }

    await group.update(req.body);

    return res.status(200).send({
      message: "Group updated successfully!",
      data: group,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update group" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;

    const group = await sequelize.models.Group.findByPk(id);

    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }

    await group.destroy();

    return res.status(200).send({ message: "Group deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete group" });
  }
};
