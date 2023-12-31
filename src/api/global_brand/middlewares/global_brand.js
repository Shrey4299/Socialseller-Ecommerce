const Joi = require("joi");
const { requestError } = require("../../../services/errors");

module.exports = {
  async validateRequest(req, res, next) {
    function validate(body) {
      const JoiSchema = Joi.object({
        name: Joi.string(),
        logo: Joi.string().uri(), // Assuming logo is stored as a URL
        tagline: Joi.string(),
        whatsapp_number: Joi.string(), // Validate phone number format
        calling_number: Joi.string(), // Validate phone number format
        email: Joi.string().email(),
        address: Joi.string(),
        about_us: Joi.string(),
      });

      return JoiSchema.validate(body);
    }

    let result = validate(req.body);
    if (result.error) {
      return res.status(400).send(
        requestError({
          status: 400,
          message: result.error.message,
          details: result.error.details,
        })
      );
    } else {
      await next();
    }
  },
};
