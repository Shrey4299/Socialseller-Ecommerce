const Joi = require("joi");
const { requestError } = require("../../../services/errors");

module.exports = {
    async validateCreateRequest(req, res, next) {
        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string().required(),
                "validity": Joi.number().positive().required(),
                "price": Joi.number().positive().required(),
                "description": Joi.string().required(),
            });
            return JoiSchema.validate(body);
        }
        let result = validate(req.body);
        if (result.error) return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }))
        else await next();

    },
    async validateUpdateRequest(req, res, next) {
        function validate(body) {
            const JoiSchema = Joi.object({
                "name": Joi.string().optional(),
                "validity": Joi.number().positive().optional(),
                "price": Joi.number().positive().optional(),
                "description": Joi.string().optional(),
                "is_active": Joi.boolean().optional()
            });
            return JoiSchema.validate(body);
        }
        let result = validate(req.body);
        if (result.error) return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }))
        else await next();
    }
}
