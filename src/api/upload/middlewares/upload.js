/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */


const Joi = require("joi");
const { requestError } = require("../../../services/errors");

module.exports = {
    async validateRequest(req, res, next) {

        function validate(body) {
            const JoiSchema = Joi.object({
                name: Joi.string().required(),
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
    async fileFormat(req, res, next) {
        try {
            if (fileType !== "image/jpeg") {
                res.status(400).send(requestError({
                    message: "Invalid file input",
                    details: "Invalid file sent on request body!"
                }))
            }
            await next()
        } catch (error) {
            console.log(error)
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "Invalid file input",
                    details: "Invalid file sent on request body!"
                }
            })
        }
    }
}
