const Joi = require("joi");

exports.validateBulkPricing = (req, res, next) => {
  const schema = Joi.object({
    from: Joi.number().integer().required(),
    to: Joi.number().integer().required(),
    price: Joi.number().integer().required(),
    premiumPrice: Joi.number().integer().required(),
    VariantId: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
};
