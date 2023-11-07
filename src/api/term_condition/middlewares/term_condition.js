
// Middleware for term_condition
// Customize the middleware code here

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

// write code below


const Joi = require("joi");
const { requestError } = require("../../../services/errors");

module.exports = {
    async validateRequest(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string(),
                "description": Joi.string(),
            });

            return JoiSchema.validate(body);
        }

        let result = validate(req.body);
        if (result.error) return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }))
        await next()
    }
}
