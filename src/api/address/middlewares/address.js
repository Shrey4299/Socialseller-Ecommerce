const Joi = require("joi");

exports.validateAddress = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    UserStoreId: Joi.number().required(),
    houseNumber: Joi.string().required(),
    addressLine1: Joi.string().required(),
    pincode: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    addressLine2: Joi.string().allow(""),
    area: Joi.string().allow(""),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
};
