
// Middleware for banner
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
                "action": Joi.string().valid(["CALL", "LINK", "WHATSAPP"]),
                "link": Joi.string().optional(),
                "ThumbnailId": Joi.number().positive().required(),
                "phone": Joi.string().required(),
                "whats_app": Joi.string().required(),
            });
            return JoiSchema.validate(body);
        }

        let result = validate(req.body);
        if (result.error) {
            return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }))
        } else {
            await next();
        }
    }
}
