const Joi = require("joi");

const validatePaymentData = (req, res, next) => {
  const paymentSchema = Joi.object({
    account_id: Joi.string().required(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    status: Joi.string().required(),
    order_id: Joi.string().required(),
    method: Joi.string().required(),
    description: Joi.string(),
    card_id: Joi.string(),
    card: Joi.object(),
    bank: Joi.string(),
    wallet: Joi.string(),
    vpa: Joi.string(),
    email: Joi.string(),
    contact: Joi.string(),
    error_code: Joi.string(),
    error_description: Joi.string(),
    acquirer_data: Joi.object(),
    upi: Joi.object(),
    base_amount: Joi.number().required(),
  });

  const { error } = paymentSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }

  next();
};

module.exports = validatePaymentData;
