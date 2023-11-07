

// Controller function to create a new post
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {

        const sequelize = req.db;
        const payment_log = await sequelize.models.payment_log.create(req.body);
        return res.status(200).send(payment_log)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a payment_log' });
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

        const payment_logs = await sequelize.models.Payment_log.findAll();

        return res.status(200).send(payment_logs)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch payment_logs' });
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
        const payment_log = await sequelize.models.payment_log.findOne({ where: { id } });
        if (payment_log) {
            return res.status(200).send(payment_log)
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch payment_log' });
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
        const getpayment_log = await sequelize.models.payment_log.findByPk(id)

        if (getpayment_log) {
            const payment_log = await sequelize.models.payment_log.update(req.body, { where: { id } });
            return res.status(200).send(payment_log)
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch payment_log' });
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
        const getpayment_log = await sequelize.models.payment_log.findByPk(id)

        if (getpayment_log) {
            const payment_log = await sequelize.models.payment_log.destroy({ where: { id } });
            return res.status(200).send(payment_log)
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch payment_log' });
    }
};

