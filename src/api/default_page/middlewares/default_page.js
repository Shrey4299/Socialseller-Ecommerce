const Joi = require("joi");

module.exports = {
  validateDefaultPage(req, res, next) {
    const schema = Joi.object({
      about_us: Joi.string().required(),
      terms_and_conditions: Joi.string().required(),
      privacy_policy: Joi.string().required(),
      refund_and_cancellation: Joi.string().required(),
      ship_and_delivery: Joi.string().required(),
      contact_us: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    next();
  },
};
