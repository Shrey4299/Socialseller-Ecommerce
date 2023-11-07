

// Controller function to create a new post

const { Sequelize, UnknownConstraintError, Op } = require("sequelize");
const { requestError } = require("../../../services/errors");
const { getPagination, getMeta } = require("../../../services/pagination");
const orderBy = require("../../../services/orderBy");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db;
        const tag = await sequelize.models.Tag.create(req.body);
        return res.status(200).send(tag)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a tag' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.createMany = async (req, res) => {
    try {
        const sequelize = req.db;
        const tag = await sequelize.models.Tag.create(req.body);
        return res.status(200).send(tag)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a tag' });
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
        const query = req.query;
        const pagination = await getPagination(query.pagination)
        const order = orderBy(query)
        const tags = await sequelize.models.Tag.findAndCountAll({
            offset: pagination.offset,
            limit: pagination.limit,
            order: order
        });
        const meta = await getMeta(pagination, tags.count)
        return res.status(200).send({ data: tags.rows, meta })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch tags' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.findOne = async (req, res) => {
    try {
        console.log(req.params)
        const sequelize = req.db;
        const { id } = req.params
        const tag = await sequelize.models.Tag.findOne({ where: { id } });
        if (!tag) return res.status(400).send(requestError({ message: "Invalid Tag ID" }))
        return res.status(200).send(tag)

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch tag' });
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
        const { id } = req.params
        const gettag = await sequelize.models.Tag.findByPk(id)

        if (!gettag) return res.status(400).send(requestError({ message: "Invalid Tag ID" }))
        const tag = await sequelize.models.Tag.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "Tag Updated!", data: tag[1][0] })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch tag' });
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
        const { id } = req.params
        const gettag = await sequelize.models.Tag.findByPk(id)

        if (!gettag) return res.status(400).send(requestError({ message: "Invalid ID" }))
        await sequelize.models.Tag.destroy({ where: { id } });
        return res.status(200).send({ message: `Tag with id ${id} deleted successfully!` })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch tag' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
// Controller function to get all posts
exports.search = async (req, res) => {
    try {
        const sequelize = req.db;
        const query = req.query;
        const qs = query.qs
        const pagination = await getPagination(query.pagination)
        const order = orderBy(query)
        const tags = await sequelize.models.Tag.findAndCountAll({
            offset: pagination.offset,
            limit: pagination.limit,
            order: order,
            where: { name: { [Op.iLike]: `%${qs}%` } }
        });
        const meta = await getMeta(pagination, tags.count)
        return res.status(200).send({ data: tags.rows, meta })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch tags' });
    }
};
