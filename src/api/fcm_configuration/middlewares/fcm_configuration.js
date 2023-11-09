const Joi = require("joi");

module.exports = {
  validateFCMConfig(req, res, next) {
    const schema = Joi.object({
      serviceAccount: Joi.object().required(),
      devicesTokensCollectionName: Joi.string().required(),
      deviceTokenFieldName: Joi.string().required(),
      deviceLabelFieldName: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }

    next();
  },
};
