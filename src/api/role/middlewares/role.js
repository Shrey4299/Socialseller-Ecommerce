
// Middleware for role
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


const Joi = require("joi")

module.exports = {
    async validateCreateBody(req, res, next) {
        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string(),
                "description": Joi.string().optional(),
                UserId: Joi.number().optional(),
                RoleId: Joi.number().optional()
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
