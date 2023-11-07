

// Controller function to create a new post

const { getPagination, getMeta } = require("../../../services/pagination");



/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {

        const sequelize = req.db;
        const plan = await sequelize.models.Plan.create(req.body);
        return res.status(200).send(plan)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a plan' });
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
        const tag = (query.tag ? query.tag : "all")
        let plans;
        const pagination = await getPagination(query.pagination)
        switch (tag) {
            case "active":
                plans = await sequelize.models.Plan.findAndCountAll({
                    where: { is_active: true }, include: [{ model: sequelize.models.Subscription, as: "subscriptions" }],
                    limit: pagination.limit,
                    offset: pagination.offset
                });
                break;
            case "inactive":
                plans = await sequelize.models.Plan.findAndCountAll({
                    where: { is_active: false }, include: [{ model: sequelize.models.Subscription, as: "subscriptions" }]
                });
                break;
            case "all":
                plans = await sequelize.models.Plan.findAndCountAll({
                    include: [{ model: sequelize.models.Subscription, as: "subscriptions" }]
                });
                break;

            default:
                break;
        }

        const meta = await getMeta(pagination, plans.count)

        return res.status(200).send({ data: plans.rows, meta })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch plans' });
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
        const plan = await sequelize.models.Plan.findByPk(id, { include: [{ model: sequelize.models.Subscription, as: "subscription" }] });
        if (plan) {
            return res.status(200).send(plan);
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch plan' });
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
        const getplan = await sequelize.models.Plan.findByPk(id)

        if (getplan) {
            const plan = await sequelize.models.Plan.update(req.body, { where: { id } });
            return res.status(200).send({ message: "Plan updated successfully!" })
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch plan' });
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
        const getplan = await sequelize.models.Plan.findByPk(id)

        if (getplan) {
            const plan = await sequelize.models.Plan.destroy({ where: { id } });
            return res.status(200).send({ message: `Plan with id-${id} deleted successfully!` })
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch plan' });
    }
};

