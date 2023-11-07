
// Middleware for product
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below

const { Op, literal } = require('sequelize');
const Joi = require("joi");
const { requestError } = require("../../../services/errors");
const jwt = require("../../../services/jwt");
const dbCache = require("../../../utils/dbCache");
const { getDate } = require("../../subscription/services/subscription");

module.exports = {
    async validateCreateBody(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                name: Joi.string().required(),
                description: Joi.string().required(),
                ThumbnailId: Joi.number().required(),
                CategoryId: Joi.number().positive().required(),
                variants: Joi.array().items(Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().positive().required(),
                    quantity: Joi.number().positive().required(),
                    ThumbnailId: Joi.number().required().positive(),
                    from: Joi.number().positive().optional(),
                    to: Joi.number().positive().optional(),
                })).required().min(1),
                tags: Joi.array().items(Joi.string()).optional()
            });

            return JoiSchema.validate(body);
        }

        let result = validate(req.body);
        if (result.error) {
            return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }));
        } else {
            await next(); // Corrected the square brackets to curly braces
        }
    },
    async validateUpdateBody(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                name: Joi.string().optional(),
                description: Joi.string().optional(),
                ThumbnailId: Joi.number().optional(),
                variants: Joi.array().items(Joi.object({
                    name: Joi.string().optional(),
                    price: Joi.number().positive().optional(),
                    quantity: Joi.number().positive().optional(),
                    ThumbnailId: Joi.number().optional(),
                    from: Joi.number().positive().optional(),
                    to: Joi.number().positive().optional()
                })).optional().min(1),
                CategoryId: Joi.number().positive().optional()
            });

            return JoiSchema.validate(body);
        }

        let result = validate(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details);
        } else {
            await next(); // Corrected the square brackets to curly braces
        }
    },
    async queryValidator(req, res, next) {
        try {
            const query = req.query;
            console.log(query)
            if (!query.qs || query.qs.length < 3) {
                return res.status(400).send(requestError({ message: (!query.qs ? "please pass query to search" : "Please use atleast 3 characters") }))
            }
            await next()
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },
    async filterValidator(req, res, next) {
        try {
            const query = req.query;
            function validateQuery(query) {
                const JoiSchema = Joi.object({
                    pagination: Joi.object().optional(),
                    price: Joi.object({
                        min: Joi.number().positive().required(),
                        max: Joi.number().positive().required()
                    }).required()
                })
                return JoiSchema.validate(query)
            }

            let result = validateQuery(query)
            if (result.error) return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }))
            await next()
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },
    async validateSubscription(req, res, next) {
        try {
            const token = jwt.verify(req)
            const mainDb = dbCache.get("main_instance")
            const sequelize = req.db;
            const user = await mainDb.models.User.findByPk(token.id, {
                include: {
                    model: mainDb.models.Subscription,
                    as: "subscriptions",
                    where: {
                        valid_to: {
                            [Op.gt]: getDate()
                        },
                        is_paid: true
                    },
                    include: "plan"
                }
            })
            const products = await sequelize.models.Product.count()
            if (user.subscriptions.length < 1) {
                return res.status(400).send(requestError({ message: "You do not have any active subscription plan" }))
            }
            if (products < user.subscriptions[0].plan.product_count) {
                await next()
            } else {
                return res.status(400).send(requestError({ message: `You have riched your products limit , your current plan's product limit is ${user.subscriptions[0].plan.product_count} ` }))
            }
            await next()
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    }

}
