const Joi = require("joi");

exports.validateAddress = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    UserId: Joi.number().optional(),
    houseNumber: Joi.string().required(),
    addressLine1: Joi.string().required(),
    pincode: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    addressLine2: Joi.string().allow(""),
    area: Joi.string().allow(""),
    email: Joi.string().email().allow(""),
    phone: Joi.string()
      .pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)
      .allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
};
