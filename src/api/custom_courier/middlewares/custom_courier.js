const Joi = require("joi");

exports.validateCustomerCourier = (req, res, next) => {
  const schema = Joi.object({
    trackingId: Joi.string().required(),
    courierName: Joi.string().required(),
    courierEmail: Joi.string().required().email(),
    phone: Joi.string().required(),
    SubscriptionId: Joi.number().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
};
