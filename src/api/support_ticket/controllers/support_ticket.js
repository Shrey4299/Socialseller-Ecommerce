

// Controller function to create a new post

const { requestError } = require("../../../services/errors");
const jwt = require("../../../services/jwt");
const { getPagination, getMeta } = require("../../../services/pagination");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db;
        const body = req.body;
        const token = jwt.verify(req)
        const support_ticket = await sequelize.models.Support_ticket.create({ title: body.title, description: body.description, UserId: token.id, status: "OPEN" });
        return res.status(200).send(support_ticket)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a support_ticket' });
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
        const support_tickets = await sequelize.models.Support_ticket.findAndCountAll({
            offset: pagination.offset,
            limit: pagination.limit
        });
        const meta = await getMeta(pagination, support_tickets.count)
        return res.status(200).send({ data: support_tickets.rows, meta })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch support_tickets' });
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
        const support_ticket = await sequelize.models.Support_ticket.findOne({ where: { id } });
        if (support_ticket) {
            return res.status(200).send(support_ticket)
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch support_ticket' });
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
        const getsupport_ticket = await sequelize.models.Support_ticket.findByPk(id)

        if (!getsupport_ticket) {
            return res.status(400).send(requestError({ message: "Invalid Ticket ID" }))
        }
        const support_ticket = await sequelize.models.Support_ticket.update(req.body, { where: { id }, returning: true });
        return res.status(200).send({ message: "Support Ticket Updated", data: support_ticket[1][0] })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch support_ticket' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

exports.changeStatus = async (req, res) => {
    try {
        const sequelize = req.db;
        const { id } = req.params
        const params = req.params;
        if (!["OPEN", "CLOSED", "IN_PROGRESS", "ON_HOLD"].includes(params.status)) {
            return res.status(400).send(requestError({ message: 'status must be one of ["OPEN", "CLOSED", "IN_PROGRESS", "ON_HOLD"]' }))
        }
        const getsupport_ticket = await sequelize.models.Support_ticket.findByPk(id)

        if (!getsupport_ticket) {
            return res.status(400).send(requestError({ message: "Invalid Ticket ID" }))
        }
        const support_ticket = await sequelize.models.Support_ticket.update({ status: params.status }, { where: { id }, returning: true });
        return res.status(200).send({ message: "Support Ticket Updated", data: support_ticket[1][0] })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch support_ticket' });
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
        const getsupport_ticket = await sequelize.models.Support_ticket.findByPk(id)

        if (getsupport_ticket) {
            const support_ticket = await sequelize.models.Support_ticket.destroy({ where: { id } });
            return res.status(200).send(support_ticket)
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch support_ticket' });
    }
};

