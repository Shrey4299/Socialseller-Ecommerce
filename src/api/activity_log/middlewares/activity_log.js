const Joi = require("joi");

exports.validateActivityLog = (req, res, next) => {
  const schema = Joi.object({
    description: Joi.string().allow(null),
    event: Joi.string()
      .valid(
        "ADMIN_LOG_IN",
        "RESELLER_LOG_IN",
        "ORDER_PLACED",
        "ORDER_ACCEPTED",
        "ORDER_DECLINED",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",
        "SUBSCRIPTION_ADDED",
        "NEW_CAMPAIGN_ADDED",
        "NEW_PRODUCT_ADDED",
        "NEW_COLLECTION_ADDED",
        "NEW_TUTORIAL_ADDED",
        "NEW_LEAD_ADDED",
        "NEW_GROUP_ADDED",
        "LEAD_COMPLETED",
        "LEAD_CALLED",
        "LEAD_CALLING",
        "LEAD_CONVERTED",
        "RESELLER_WITHDRAW",
        "RESELLER_PAYOUT",
        "WALLET_DEBIT",
        "WALLET_CREDIT"
      )
      .required(),
    UserId: Joi.number().allow(null),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  next();
};
