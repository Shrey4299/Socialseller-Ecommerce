// productMetricsService.js
const createOrUpdateProductMetrics = async (sequelize, variant, amount) => {
  try {
    const productId = variant.ProductId;

    let productMetrics = await sequelize.models.Product_metrics.findOne({
      where: { ProductId: productId },
    });

    if (productMetrics) {
      // If a record exists, update it
      productMetrics.view_count += 1;
      productMetrics.ordered_count += 1;
      productMetrics.revenue_generated += amount;

      await productMetrics.save();
    } else {
      // If no record exists, create a new one
      productMetrics = await sequelize.models.Product_metrics.create({
        view_count: 1,
        ordered_count: 1,
        shares_count: 0,
        revenue_generated: amount,
        ProductId: productId,
      });
    }

    return productMetrics;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  createOrUpdateProductMetrics,
};
