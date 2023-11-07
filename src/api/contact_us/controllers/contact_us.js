

// Controller function to create a new post
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

const { requestError } = require("../../../services/errors");
const orderBy = require("../../../services/orderBy");
const { getPagination, getMeta } = require("../../../services/pagination");

exports.create = async (req, res) => {
    try {

        const sequelize = req.db;
        const contact_us = await sequelize.models.Contact_us.create(req.body);
        return res.status(200).send(contact_us)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a contact_us' });
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
        const contact_us = await sequelize.models.Contact_us.findAndCountAll({
            offset: pagination.offset,
            limit: pagination.limit,
            order: order
        });
        const meta = await getMeta(pagination, contact_us.count)

        return res.status(200).send({ data: entries.rows, meta })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch contact_uss' });
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
        const { id } = req.params
        const contact_us = await sequelize.models.Contact_us.findByPk(id);
        if (!contact_us) {
            return res.status(400).send(requestError({ message: "Invalid ID" }))
        }
        return res.status(200).send(contact_us)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch contact_us' });
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
        const getcontact_us = await sequelize.models.Contact_us.findByPk(id)

        if (!getcontact_us) {
            return res.status(400).send(requestError({ message: "Invalid ID" }))
        }
        const contact_us = await sequelize.models.Contact_us.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "contact_us updated", data: contact_us[1][0] })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch contact_us' });
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
        const getcontact_us = await sequelize.models.Contact_us.findByPk(id)

        if (getcontact_us) {
            return res.status(400).send(requestError({ message: "Invalid ID" }))
        }
        const contact_us = await sequelize.models.Contact_us.destroy({ where: { id } });
        return res.status(200).send({ message: "query deleted!" })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch contact_us' });
    }
};

