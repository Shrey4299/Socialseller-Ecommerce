const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  tag: Joi.string().required(),
});

module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
