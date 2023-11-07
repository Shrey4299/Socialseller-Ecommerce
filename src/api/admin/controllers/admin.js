const dbCache = require('../../../utils/dbCache')
const { Sequelize } = require('sequelize')
const jwt = require('../../../services/jwt')
const { hash, compare } = require('../../../services/bcrypt')
const { Op } = require('sequelize')
const { tokenError, requestError } = require('../../../services/errors')
const { getPagination, getMeta } = require('../../../services/pagination')
const orderBy = require('../../../services/orderBy')


module.exports = {
    async create(req, res) {
        try {
            const sequelize = req.db;
            const { username, email, password } = req.body;
            const findUser = await sequelize.models.User.findOne({
                where: [
                    { username },
                    { email },
                ]
            })
            const findAdminRole = await sequelize.models.Role.findOne({ where: { name: "admin" }, attributes: ['id'] })
            if (findUser) return res.status(409).send({
                error: {
                    staus: 409,
                    message: "Credentials Already Exists",
                    details: "Entered Credentials are already exists!"
                }
            })
            // encrypting password
            const hashedPassword = await hash(password)
            // creating user 
            const createAdmin = await sequelize.models.User.create({
                "username": username,
                "email": email,
                "password": hashedPassword,
                "RoleId": findAdminRole.id
            })
            return res.status(200).send({
                message: "Admin created successfully!",
                data: createAdmin
            })

        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },

    async dashboard(req, res) {
        try {
            const sequelize = req.db;
            const [users, admins, subscriptions, active_plans, inactive_plans, total_plans, roles, transactions] = await Promise.all([
                sequelize.models.User.count({
                    include: {
                        model: sequelize.models.Role, as: "role", where: { name: { [Op.ne]: "admin" } }
                    }
                }),
                sequelize.models.User.count({
                    include: {
                        model: sequelize.models.Role, as: "role", where: { name: { [Op.eq]: "admin" } }
                    }
                }),
                sequelize.models.Subscription.count({
                    where: { is_paid: true }
                }),
                sequelize.models.Plan.count({
                    where: { is_active: true }
                }),
                sequelize.models.Plan.count({
                    where: { is_active: false }
                }),
                sequelize.models.Plan.count(),
                sequelize.models.Role.count(),
                sequelize.models.Payment_log.count()
            ])


            return res.status(200).send({
                users, transactions, admins,
                subscriptions,
                plans: { active_plans, inactive_plans, total_plans },
                roles,
            })

        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    }
}

