// Controller function to create a new post

const { Sequelize } = require("sequelize");
const { getPagination, getMeta } = require("../../../services/pagination");
const { Op, literal, or } = require("sequelize");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const category = await sequelize.models.Category.create(req.body);
    return res.status(200).send(category);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a category" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
// Controller function to get all posts
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const categories = await sequelize.models.Category.findAll({
      include: ["thumbnail"],
    });
    return res.status(200).send(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch categorys" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const category = await sequelize.models.Category.findByPk(id, {
      include: ["thumbnail"],
    });
    if (category) {
      return res.status(200).send(category);
    } else {
      return res.status(400).send({ error: "Invalid Id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch category" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const body = req.body;
    const getcategory = await sequelize.models.Category.findByPk(id);

    if (getcategory) {
      const category = await sequelize.models.Category.update(req.body, {
        where: { id },
      });
      if (body.hasOwnProperty("thumbnail")) {
        await sequelize.models.Media.update(
          { CategoryId: id },
          { where: { id: body.thumbnail } }
        );
      }
      return res
        .status(200)
        .send({ message: "category updated successfully!" });
    } else {
      return res.status(400).send({ error: "Invalid Id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch category" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const getcategory = await sequelize.models.Category.findByPk(id);

    if (getcategory) {
      const category = await sequelize.models.Category.destroy({
        where: { id },
      });
      return res
        .status(200)
        .send({ message: "category deleted successfully!" });
    } else {
      return res.status(400).send({ error: "Invalid Id" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch category" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getProducts = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const category = await sequelize.models.Category.findByPk(id, {
      include: ["products"],
      distinct: true,
      offset: pagination.offset,
      limit: pagination.limit,
    });
    if (category) {
      const meta = await getMeta(pagination, 1);
      return res.status(200).send({ data: category, meta });
    } else {
      return res.status(400).send({ error: "Invalid Id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch category" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.searchInCategory = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const { query } = req.query;
    const pagination = await getPagination(req.query.pagination);



    const products = await sequelize.models.Product.findAll({
      where: {
        CategoryId: id,
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
    next(error);
  }
};
