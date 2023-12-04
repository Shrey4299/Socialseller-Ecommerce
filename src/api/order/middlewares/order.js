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
};
