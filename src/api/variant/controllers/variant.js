// Controller function to create a new post
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

const { requestError } = require("../../../services/errors");

exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const variant = await sequelize.models.Variant.create(req.body);
    return res
      .status(200)
      .send({ message: "Variant created successfully!", data: variant });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a variant" });
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
    const variant = await sequelize.models.Variant.findAll({
      include: ["thumbnail", "product"],
    });
    return res.status(200).send(variant);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch variant" });
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
    const variant = await sequelize.models.Variant.findByPk(id, {
      include: ["product", "thumbnail"],
    });
    if (variant) {
      return res.status(200).send(variant);
    } else {
      return res
        .status(400)
        .send(requestError({ message: "Invalid Variant ID" }));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch variant" });
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
    const getVariant = await sequelize.models.Variant.findByPk(id);
    if (!getVariant) {
      return res
        .status(400)
        .send(requestError({ message: "Invalid Variant ID" }));
    }
    const variant = await sequelize.models.Variant.update(body, {
      where: { id },
      returning: true,
    });
    return res
      .status(200)
      .send({ message: "Variant updated successfully!", data: variant[1][0] });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update variant" });
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
    const getVariant = await sequelize.models.Variant.findByPk(id);
    if (!getVariant) {
      return res.status(400).send({ error: "Invalid variant Id" });
    }
    const variant = await sequelize.models.Variant.destroy({ where: { id } });
    return res.status(200).send({ message: "variant deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete variant" });
  }
};
