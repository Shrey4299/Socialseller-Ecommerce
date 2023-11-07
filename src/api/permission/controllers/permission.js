

// Controller function to create a new post

const app = require("../../../../server");
const generatePermission = require("../services/apiLists");

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.generateLists = async (req, res) => {
    try {
        const sequelize = req.db
        const permission_list = await generatePermission(app)
        console.log(sequelize)
        let lists = []
        for (const item of permission_list) {

            const [found, created] = await sequelize.models.Permission.findOrCreate({ where: { api: item.api, method: item.method, endpoint: item.endpoint } })
            console.log(found, created)
            lists.push([found, created])
        }
        return res.status(200).send({ lists, message: "Permission Generated Successfully!" })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a permission' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db;
        const { RoleId, PermissionId } = req.body;
        const lists = [];
        for (const permission of PermissionId) {
            const [found, created] = await sequelize.models.Role_permission.findOrCreate({ where: { PermissionId: permission, RoleId }, default: { RoleId, PermissionId: permission } })
            lists.push([found, created])
        }

        // const payload = PermissionId.map((id) => {
        //     return { RoleId, PermissionId: id }
        // })
        return res.status(200).send(lists)
        const permission = await sequelize.models.Role_permission.create(req.body);
        return res.status(200).send({ data: permission, message: "Permission Created Successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a permission' });
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

        const permissions = await sequelize.models.Permission.findAll({
            include: ["roles"]
        });

        return res.status(200).send(permissions)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch permissions' });
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
        const permission = await sequelize.models.Permission.findByPk(id, { include: "roles" })
        if (permission) {
            return res.status(200).send(permission)
        } else {
            return res.status(400).send({ error: "Invalid User Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch permission' });
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
        const permission = await sequelize.models.permission.update(req.body, { where: { id } });
        if (permission) {
            return res.status(200).send({ message: "Permission Updated successfully!" })
        } else {
            return res.status(400).send({ error: "Invalid User Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch permission' });
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
        const permission = await sequelize.models.permission.destroy({ where: { id } });
        if (permission) {
            return res.status(200).send({ message: "Permssion Deleted Successfully!" })
        } else {
            return res.status(400).send({ error: "Invalid User Id" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch permission' });
    }
};

