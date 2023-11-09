const Joi = require("joi");

module.exports = {
  validateFreePlan(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      maxUsers: Joi.number().integer().required(),
      maxProducts: Joi.number().integer().required(),
      expiryDays: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    next();
  },
};
