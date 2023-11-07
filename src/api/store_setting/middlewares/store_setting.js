// Middleware for global
// Customize the middleware code here

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

// write code below

const Joi = require("joi");
const { requestError } = require("../../../services/errors");

module.exports = {
  async validateRequest(req, res, next) {
    function validate(body) {
      const JoiSchema = Joi.object({
        RAZORPAY_KEY_ID: Joi.string().required(),
        RAZORPAY_KEY_SECRET: Joi.string().required(),
        RAZORPAY_WEBHOOK_SECRETE: Joi.string().required(),
        PAYMENT_GATEWAY: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
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
      await next(); // Corrected the square brackets to curly braces
    }
  },
};
