const Joi = require("joi");

exports.validateTutorial = (req, res, next) => {
  const schema = Joi.object({
    thumbnail: Joi.string().allow(null),
    name: Joi.string().allow(null),
    video_url: Joi.string().allow(null),
    description: Joi.string().allow(null),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
};
