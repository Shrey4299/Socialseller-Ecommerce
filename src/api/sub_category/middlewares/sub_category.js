const Joi = require("joi");
const { requestError } = require("../../../services/errors");

module.exports = {
  async validateRequest(req, res, next) {
    function validate(body) {
      const JoiSchema = Joi.object({
        store_mode: Joi.string().valid(
          "WHATSAPP",
          "B2B",
          "ECOM",
          "RESELLER_ECOM"
        ),
        primary_color: Joi.string(),
        secondary_color: Joi.string(),
        bg_color: Joi.string(),
        text_color: Joi.string(),
        button_color: Joi.string(),
        is_app_enabled: Joi.boolean(),
        is_maintenance_mode: Joi.boolean(),
        is_store_active: Joi.boolean(),
        store_inactive_message: Joi.string().allow(""),
        store_maintenance_message: Joi.string().allow(""),
        is_pricing_visible: Joi.boolean(),
        is_cart_enabled: Joi.boolean(),
        is_wallet_enabled: Joi.boolean(),
        product_card_style: Joi.string().valid("PORTRAIT", "SQUARE"),
        category_card_style: Joi.string().valid("LANDSCAPE", "SQUARE"),
        product_list_span_mobile: Joi.number().integer(),
        product_list_span_desktop: Joi.number().integer(),
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
