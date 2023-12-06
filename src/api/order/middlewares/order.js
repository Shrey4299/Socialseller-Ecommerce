const jwt = require("../../../services/jwt");
const { tokenError, requestError } = require("../../../services/errors");

module.exports = {
  async validateRequest(req, res, next) {
    try {
      console.log("entered in validate request");
      const sequelize = req.db;
      const { variantQuantities } = req.body;

      for (const variantData of variantQuantities) {
        const { VariantId, quantity } = variantData;

        const variant = await sequelize.models.Variant.findByPk(VariantId);

        if (!variant || variant.quantity < quantity) {
          return res.status(400).send({
            message: `Insufficient quantity for VariantId ${VariantId}.`,
          });
        }

        if (quantity <= 0) {
          return res.status(400).send({
            message: `Invalid quantity for VariantId ${VariantId}. Must be greater than 0.`,
          });
        }
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  async validateWalletOrder(req, res, next) {
    try {
      console.log("entered in validate wallet order");
      const sequelize = req.db;

      const { variantQuantities } = req.body;

      const token = jwt.verify(req);
      if (token.error) {
        return res.status(401).send(tokenError(token));
      }
      const user = await sequelize.models.User_store.findByPk(token.id);

      if (!user) {
        return res.status(400).send(
          requestError({
            message: "Invalid Data!",
            details: "Invalid payload data found in token!",
          })
        );
      }

      if (!variantQuantities || !Array.isArray(variantQuantities)) {
        return res
          .status(400)
          .json({ error: "Invalid variantQuantities in the request body" });
      }

      const variants = await sequelize.models.Variant.findAll();

      const totalAmount = variantQuantities.reduce(
        (sum, { VariantId, quantity }) => {
          const variant = variants.find((v) => v.id === VariantId);
          return sum + variant.price * quantity;
        },
        0
      );

      if (user.wallet_balance < totalAmount) {
        return res.status(400).send({
          message: `Insufficient amount in the wallet.`,
        });
      }

      req.totalAmount = totalAmount;
      req.UserStoreId = user.id;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },
};
