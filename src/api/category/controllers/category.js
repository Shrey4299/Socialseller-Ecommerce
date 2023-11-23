// Controller function to create a new post

const { Sequelize } = require("sequelize");
const { getPagination, getMeta } = require("../../../services/pagination");

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
exports.getProducts = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    console.log(id);
    const category = await sequelize.models.Category.findByPk(id, {
      include: ["thumbnail"],
    });
    console.log(category);
    if (category) {
      const query = req.query;
      const pagination = await getPagination(query.pagination);
      const products = await sequelize.models.Product.findAndCountAll({
        distinct: true,
        offset: pagination.offset,
        limit: pagination.limit,
      });
      const meta = await getMeta(pagination, products.count);
      return res.status(200).send({ category, data: products.rows, meta });
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
