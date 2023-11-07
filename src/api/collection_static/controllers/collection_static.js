const { getPagination, getMeta } = require("../../../services/pagination");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const getCollectionStatic =
      await sequelize.models.Collection_static.findAll();
    if (getCollectionStatic.length !== 0) {
      const updateCollectionStatic =
        await sequelize.models.Collection_static.update(req.body, {
          where: {
            id: getCollectionStatic[0].id,
          },
          returning: true,
        });
      return res.status(200).send({
        message: "Collection Static Updated Successfully!",
        data: updateCollectionStatic[1][0],
      });
    } else {
      const collectionStatic = await sequelize.models.Collection_static.create(
        req.body
      );
      return res.status(200).send({
        message: "Collection Static Created Successfully!",
        data: collectionStatic,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to create/update collection static" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const collectionStatic = await sequelize.models.Collection_static.findOne();
    return res.status(200).send(collectionStatic);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch collection static" });
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
    const collectionStatic = await sequelize.models.Collection_static.findByPk(
      id
    );

    if (!collectionStatic) {
      return res.status(404).send({ error: "Collection Static not found" });
    }

    await collectionStatic.update(req.body);

    return res.status(200).send({
      message: "Collection Static Updated Successfully!",
      data: collectionStatic,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to update collection static" });
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
    const collectionStatic = await sequelize.models.Collection_static.findByPk(
      id
    );

    if (!collectionStatic) {
      return res.status(404).send({ error: "Collection Static not found" });
    }

    await collectionStatic.destroy();

    return res
      .status(200)
      .send({ message: "Collection Static Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to delete collection static" });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getProducts = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const collectionStatic = await sequelize.models.Collection_static.findByPk(
      id
    );

    if (!collectionStatic) {
      return res.status(404).send({ error: "Collection Static not found" });
    }

    const pagination = await getPagination(req.query.pagination);
    const products = await sequelize.models.Product.findAndCountAll({
      distinct: true,
      include: [
        {
          model: sequelize.models.Collection_static,
          as: "collection_static",
          where: { id },
        },
      ],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, products.count);
    return res
      .status(200)
      .send({ collectionStatic, data: products.rows, meta });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to fetch products from Collection Static" });
  }
};
