exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const collection = await sequelize.models.Collection.create(req.body);
    return res
      .status(200)
      .send({ message: "Collection Created Successfully!", data: collection });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create collection" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const collectionId = req.params.id;
    const [updatedRowsCount, updatedCollection] =
      await sequelize.models.Collection.update(req.body, {
        where: { id: collectionId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Collection not found" });
    }
    return res
      .status(200)
      .send({
        message: "Collection Updated Successfully!",
        data: updatedCollection[0],
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the collection" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;
    const collections = await sequelize.models.Collection.findAll({
      include: "products",
    });
    return res.status(200).send(collections);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch collections" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const collectionId = req.params.id;
    const collection = await sequelize.models.Collection.findOne({
      where: { id: collectionId },
      include: "products",
    });
    if (!collection) {
      return res.status(404).send({ error: "Collection not found" });
    }
    return res.status(200).send(collection);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the collection" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const collectionId = req.params.id;
    const deletedRowCount = await sequelize.models.Collection.destroy({
      where: { id: collectionId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Collection not found" });
    }
    return res
      .status(200)
      .send({ message: "Collection Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the collection" });
  }
};
