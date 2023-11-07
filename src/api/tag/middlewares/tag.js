
// Middleware for tag
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
                    "name": Joi.string(),
                });

            return JoiSchema.validate(body);
        }
  
      let result = validate(req.body);
        if(result.error) {
        return res.status(400).send({ error: {
            status: 400,
            message: result.error.message,
            details: result.error.details
        }});
    } else {
        await next(); // Corrected the square brackets to curly braces
    }
}
}
