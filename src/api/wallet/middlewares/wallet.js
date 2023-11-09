
// Middleware for product-variant
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


const Joi = require("joi")

module.exports = {
    async createBody(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string().required(),
                "price": Joi.number().required().positive(),
                "quantity": Joi.number().required().positive(),
                "productId": Joi.number().positive().required(),
                "ThumbnailId": Joi.number().positive().optional()
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

    async updateBody(req, res, next) {
        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string().optional(),
                "price": Joi.number().optional().positive(),
                "quantity": Joi.number().optional().positive(),
                "thumbnail": Joi.number().optional().positive()
            });
            return JoiSchema.validate(body);
        }

        let result = validate(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details);
        } else {
            await next();
        }
    }
}
