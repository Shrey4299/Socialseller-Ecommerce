
// Middleware for store_info
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


const Joi = require("joi")

module.exports = {
    async validateRequest(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string().required(),
                "address": Joi.string().required(),
                "location": Joi.string().optional().allow(""),
                "BannerId": Joi.number().required().positive(),
                "LogoId": Joi.number().required().positive()
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
    async validateUpdateRequest(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string().optional(),
                "address": Joi.string().optional(),
                "location": Joi.string().optional().allow(""),
                "BannerId": Joi.number().optional().positive(),
                "LogoId": Joi.number().optional().positive()
            });

            return JoiSchema.validate(body);
        }

        let result = validate(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details);
        } else {
            await next(); // Corrected the square brackets to curly braces
        }
    }
}
