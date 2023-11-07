const Joi = require("joi");

exports.validateCollection = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    tag: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
};
