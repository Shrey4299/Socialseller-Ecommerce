const Joi = require("joi");

module.exports = {
  async validateRequest(req, res, next) {
    function validate(body) {
      const JoiSchema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        country_code: Joi.string().required(),
        status: Joi.string()
          .valid(
            "NEW",
            "ASSIGNED",
            "CALLING",
            "CALLED",
            "CONVERTED",
            "COMPLETED"
          )
          .required(),
        source: Joi.string()
          .valid(
            "WHATSAPP",
            "INSTAGRAM",
            "SOCIAL_SELLER_WEBSITE",
            "YOUTUBE_CHANNEL",
            "APP",
            "WEBSITE"
          )
          .required(),
        consumer_note: Joi.string(), // Adjust validation as needed
        staff_note: Joi.string(), // Adjust validation as needed
        quantity: Joi.number().integer().min(0), // Adjust validation as needed
      });

      return JoiSchema.validate(body);
    }

    let result = validate(req.body);
    if (result.error) return res.status(400).send("error occured ");
    else await next();
  },
};
