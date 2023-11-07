
// Middleware for subscription
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


const Joi = require("joi");
const { Op } = require("sequelize");
const jwt = require("../../../services/jwt");
const { requestError } = require("../../../services/errors");
const { getDate } = require("../services/subscription");

module.exports = {
    async validateRequest(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                "order_id": Joi.string().required(),
                "order_type": Joi.string().required(),
                "plan_id": Joi.number().required().positive()
            });

            return JoiSchema.validate(body);
        }

        let result = validate(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details);
        } else {
            await next();
        }
    },

    async checkPlan(req, res, next) {
        try {

            const sequelize = req.db
            if (!req.body.hasOwnProperty("plan_id")) return res.status(400).send({
                error: {
                    status: 400,
                    message: "Bad Request!",
                    details: "plan_id is required please provide!"
                }
            })
            const plan_id = req.body.plan_id
            const plan = await sequelize.models.Plan.findByPk(plan_id);

            if (plan.is_active) {
                req.plan_day = plan.validity
                await next()
            } else {
                return res.status(400).send({
                    error: {
                        status: 400,
                        message: "Bad Request!",
                        details: "Invalid Plan Id "
                    }
                })
            }

        } catch (error) {
            console.log(error)
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "Bad Request!",
                    details: "Invalid Plan Id "
                }
            })
        }
    }
    ,
    async validateTags(req, res, next) {
        try {
            console.log("inside subscription validate tag")
            const query = req.query
            const modeArray = ["online", "cash", "all"];
            const tagArray = ["paid", "unpaid", "all"]
            let validMode;
            let validTag;
            let mode;
            let tag;
            if (query.hasOwnProperty("mode")) {
                if (modeArray.includes(query.mode.toLowerCase())) {
                    validMode = true;
                    mode = query.mode.toLowerCase()
                } else {
                    return res.status(400).send({
                        error: {
                            status: 400,
                            message: "Bad Request!",
                            details: `Invalid mode type passed , please select from ${modeArray}`
                        }
                    })
                }
            }
            if (query.hasOwnProperty("tag")) {
                if (tagArray.includes(query.tag.toLowerCase())) {
                    tag = (query.tag == "paid" ? true : query.tag == "unpaid" ? false : { [Op.ne]: null }) // conditional operator for is_paid [true or false]
                    validTag = true
                } else {
                    return res.status(400).send({
                        error: {
                            status: 400,
                            message: "Bad Request!",
                            details: `Invalid tag type passed , please select from ${tagArray}`
                        }
                    })
                }
            }

            req.query.mode = mode;
            req.query.tag = tag;
            console.log(req.query)
            next()
        } catch (error) {
            console.log(error)
            return res.status(400).send(error)
        }
    },
    async checkExistingSubscription(req, res, next) {
        try {
            const sequelize = req.db;

            const token = jwt.verify(req);
            console.log(token)
            const user = await sequelize.models.User.findByPk(token.id, {
                distinct: true,
                include: [
                    {
                        model: sequelize.models.Subscription,
                        as: "subscriptions",
                        where: {
                            [Op.and]: [
                                {
                                    valid_to: {
                                        [Op.gt]: getDate()
                                    },
                                    is_paid: true
                                }
                            ]
                        },
                        include: "plan"
                    },
                    // Unconditional association for subscriptions
                    {
                        model: sequelize.models.Subscription,
                        as: "subscriptions",
                        required: false // This makes it not required
                    }
                ]
            })

            if (user.subscriptions.length > 0) {
                return res.status(400).send(requestError({ message: "You have already existing subscription please wait until it expires" }))
            }
            await next()
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },
    async validateUserSubscription(req, res, next) {
        try {
            const sequelize = req.db;
            const token = jwt.verify(req)
            const { id } = req.params;
            const subscription = await sequelize.models.Subscription.findByPk(id, { include: ["user", "plan"] })
            if (!subscription) return res.status(requestError({ message: "Invalid Subscription ID" }))
            if (subscription.user.id === token.id && subscription.purchaseType === "ONLINE") {
                req.body.subscription = subscription;
                await next()
            } else {
                return res.status(400).send(requestError({ message: "Invalid Request", details: "Token and Subsciption do not belongs to same user" }))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    }
}
