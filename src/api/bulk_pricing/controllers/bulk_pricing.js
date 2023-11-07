exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const bulkPricing = await sequelize.models.Bulk_pricing.create(req.body);
    return res
      .status(200)
      .send({
        message: "Bulk Pricing Created Successfully!",
        data: bulkPricing,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create bulk pricing" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const pricingId = req.params.id;
    const [updatedRowsCount, updatedPricing] =
      await sequelize.models.Bulk_pricing.update(req.body, {
        where: { id: pricingId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Bulk Pricing not found" });
    }
    return res
      .status(200)
      .send({
        message: "Bulk Pricing Updated Successfully!",
        data: updatedPricing[0],
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the bulk pricing" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;
    const pricing = await sequelize.models.Bulk_pricing.findAll();
    return res.status(200).send(pricing);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch bulk pricing" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const pricingId = req.params.id;
    const pricing = await sequelize.models.Bulk_pricing.findOne({
      where: { id: pricingId },
    });
    if (!pricing) {
      return res.status(404).send({ error: "Bulk Pricing not found" });
    }
    return res.status(200).send(pricing);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the bulk pricing" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const pricingId = req.params.id;
    const deletedRowCount = await sequelize.models.Bulk_pricing.destroy({
      where: { id: pricingId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Bulk Pricing not found" });
    }
    return res
      .status(200)
      .send({ message: "Bulk Pricing Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the bulk pricing" });
  }
};
