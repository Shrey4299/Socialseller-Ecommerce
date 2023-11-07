

// Controller function to create a new post

const { Op } = require("sequelize");
const { requestError } = require("../../../services/errors");
const orderBy = require("../../../services/orderBy");
const { getPagination, getMeta } = require("../../../services/pagination");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db;
        const lead = await sequelize.models.Lead.create(req.body);
        return res.status(200).send({ message: "Lead Created successfully!", data: lead })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a lead' });
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
        const pagination = await getPagination(query.pagination);
        const order = orderBy(query)
        const leads = await sequelize.models.Lead.findAndCountAll({
            limit: pagination.limit,
            offset: pagination.offset,
            order: order
        });
        const meta = await getMeta(pagination, leads.count)
        return res.status(200).send({ data: leads.rows, meta })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch leads' });
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
        const lead = await sequelize.models.Lead.findOne({ where: { id } });
        if (!lead) return res.status(400).send(requestError({ message: "Invalid Lead Id To Fetch" }))
        return res.status(200).send(lead)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch lead' });
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
        const getlead = await sequelize.models.Lead.findByPk(id)

        if (!getlead) return res.status(400).send(requestError({ message: "Invalid Lead Id To Fetch" }))
        const lead = await sequelize.models.Lead.update(req.body, { where: { id } });
        return res.status(200).send({ message: "Lead Updated Successfully!" })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch lead' });
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
        const getlead = await sequelize.models.Lead.findByPk(id)
        if (!getlead) return res.status(400).send(requestError({ message: "Invalid Lead Id To Fetch" }))
        const lead = await sequelize.models.Lead.destroy({ where: { id } });
        return res.status(200).send({ message: "Lead Deleted Successfully!" })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch lead' });
    }
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

exports.search = async (req, res) => {
    try {
        const sequelize = req.db;
        const query = req.query;
        const qs = query.qs.trim();
        const pagination = await getPagination(query.pagination)

        const leads = await sequelize.models.Lead.findAndCountAll({
            offset: pagination.offset,
            limit: pagination.limit,
            order: orderBy(query),
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${qs}%` } },
                    { phone: { [Op.iLike]: `%${qs}%` } },
                    { email: { [Op.iLike]: `%${qs}%` } },
                ]
            }
        })

        const meta = await getMeta(pagination, leads.count)
        return res.status(200).send({ data: leads.rows, meta })

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}
