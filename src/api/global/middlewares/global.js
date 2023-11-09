const Joi = require("joi");
const { requestError } = require("../../../services/errors");

module.exports = {
  async validateRequest(req, res, next) {
    function validate(body) {
      const JoiSchema = Joi.object({
        subscriptionPrice: Joi.number().required(),
        codPrepaidAmount: Joi.number().required(),
        shippingPrice: Joi.number().required(),
        razorpayKey: Joi.string().required(),
        razorpaySecret: Joi.string().required(),
        withdrawLimit: Joi.number().required(),
        razorpayXAccountNumber: Joi.string().required(),
        shiprocket_username: Joi.string().required(),
        shiprocket_password: Joi.string().required(),
        is_shiprocket_enabled: Joi.boolean().required(),
        token: Joi.string().required(),
        selected_payment_gateway: Joi.string().valid(
          "RAZORPAY",
          "CASHFREE",
          "PHONEPE",
          "NONE"
        ),
        cashfree_client_secret: Joi.string().required(),
        cashfree_client_id: Joi.string().required(),
        phonepe_merchant_id: Joi.string().required(),
        phonepe_merchant_key: Joi.string().required(),
        phonepe_key_index: Joi.string().required(),
        firebase_auth: Joi.object().required(),
        user_verification_method: Joi.string().valid("FIREBASE", "MSG91"),
      });

      return JoiSchema.validate(body);
    }

    let result = validate(req.body);
    if (result.error) {
      return res.status(400).send(
        requestError({
          status: 400,
          message: result.error.message,
          details: result.error.details,
        })
      );
    } else {
      await next();
    }
  },
};
