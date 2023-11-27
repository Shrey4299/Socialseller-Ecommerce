const { getPagination, getMeta } = require("../../../services/pagination");
const { Op } = require("sequelize");

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
    return res.status(200).send({
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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getProductsFromCollection = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const collection = await sequelize.models.Collection.findByPk(id);

    if (!collection) {
      return res.status(404).send({ error: "Collection not found" });
    }

    const pagination = await getPagination(req.query.pagination);
    const products = await sequelize.models.Product.findAndCountAll({
      distinct: true,
      include: [
        {
          model: sequelize.models.Collection,
          as: "collection",
          where: { id },
        },
      ],
      offset: pagination.offset,
      limit: pagination.limit,
    });

    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ collection, data: products.rows, meta });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to fetch products from Collection" });
  }
};

exports.searchProductsInCollection = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const { query } = req.query;

    console.log(id + " this is id");

    const pagination = await getPagination(req.query.pagination);

    const products = await sequelize.models.Product.findAll({
      where: {
        CollectionId: id,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      offset: pagination.offset,
      limit: pagination.limit,
    });

    if (products.length > 0) {
      const meta = await getMeta(pagination, products.length);
      return res.status(200).send({ data: products, meta });
    } else {
      return res.status(404).send({
        error:
          "No products found in the specified category with the given search query",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch products" });
  }
};
