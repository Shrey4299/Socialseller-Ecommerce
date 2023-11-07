const Joi = require("joi");

module.exports = {
  async validateFindOneRequest(req, res, next) {
    const findOneCartSchema = Joi.object({
      cartId: Joi.number().required(),
    });

    const { error } = findOneCartSchema.validate(req.params);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    await next();
  },

  async validateAddToCartRequest(req, res, next) {
    const addToCartSchema = Joi.object({
      variantQuantities: Joi.array()
        .items({
          VariantId: Joi.number().required(),
          quantity: Joi.number().integer().min(1).required(),
        })
        .required(),
      //   cartId: Joi.number().required(),
    });

    const { error } = addToCartSchema.validate(req.body);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    await next();
  },

  async validateEmptyCartRequest(req, res, next) {
    const emptyCartSchema = Joi.object({
      cartId: Joi.number().required(),
    });

    const { error } = emptyCartSchema.validate(req.params);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    await next();
  },

  async validateDeleteVariantRequest(req, res, next) {
    const deleteVariantSchema = Joi.object({
      cartId: Joi.number().required(),
      variantId: Joi.number().optional(),
    });

    const { error } = deleteVariantSchema.validate(req.params);

    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    await next();
  },
};
