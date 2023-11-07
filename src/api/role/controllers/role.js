

// Controller function to create a new role

const { requestError } = require("../../../services/errors");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db
        console.log(sequelize)
        const role = await sequelize.models.Role.create(req.body);
        return res.status(200).send(role)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a role' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
// Controller function to get all roles
exports.find = async (req, res) => {
    try {

        const sequelize = req.db
        const roles = await sequelize.models.Role.findAll();
        console.log(roles)
        return res.status(200).send(roles)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch roles' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.findOne = async (req, res) => {
    try {
        const sequelize = req.db
        const { id } = req.params
        const role = await sequelize.models.Role.findOne({ where: { id } });
        if (role) {
            return res.status(200).send(role)
        } else {
            return res.status(400).send({ error: "Invalid User Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch role' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

exports.update = async (req, res) => {
    try {
        const sequelize = req.db
        const { id } = req.params
        const role = await sequelize.models.Role.update(req.body, { where: { id } });
        if (role) {
            return res.status(200).send({ message: "Role Updated successfully!" })
        } else {
            return res.status(400).send(requestError({ message: "Invalid Role ID" }))
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch role' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

exports.delete = async (req, res) => {
    try {
        const sequelize = req.db
        const { id } = req.params
        const role = await sequelize.models.Role.destroy({ where: { id } });
        if (role) {
            return res.status(200).send({ message: "Role Deleted successfully!" })
        } else {
            return res.status(400).send(requestError({ message: "Invalid Role ID" }))
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch role' });
    }
};

