exports.create = async (req, res) => {
  try {
    const { sequelize } = req.db;

    const subCategory = await sequelize.models.Sub_category.create(req.body);
    return res.status(200).send({
      message: "Sub-category created successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create sub-category" });
  }
};

exports.update = async (req, res) => {
  try {
    const { sequelize } = req.db;

    const { id } = req.params;
    const subCategory = await sequelize.models.Sub_category.findByPk(id);

    if (!subCategory) {
      return res.status(404).send({ error: "Sub-category not found" });
    }

    await subCategory.update(req.body);

    return res.status(200).send({
      message: "Sub-category updated successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update sub-category" });
  }
};

exports.get = async (req, res) => {
  try {
    const { sequelize } = req.db;

    const subCategories = await sequelize.models.Sub_category.findAll();
    return res.status(200).send({ data: subCategories });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to retrieve sub-categories" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { sequelize } = req.db;

    const { id } = req.params;
    const subCategory = await sequelize.models.Sub_category.findByPk(id);

    if (!subCategory) {
      return res.status(404).send({ error: "Sub-category not found" });
    }

    return res.status(200).send({ data: subCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to retrieve sub-category" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { sequelize } = req.db;

    const { id } = req.params;
    const subCategory = await sequelize.models.Sub_category.findByPk(id);

    if (!subCategory) {
      return res.status(404).send({ error: "Sub-category not found" });
    }

    await subCategory.destroy();

    return res
      .status(200)
      .send({ message: "Sub-category deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete sub-category" });
  }
};
