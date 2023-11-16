
const updatePlanMetrics = async (sequelize, planId, amount) => {
  try {
    const existingMetrics = await sequelize.models.Plan_metrics.findOne({
      where: { PlanId: planId },
    });

    if (existingMetrics) {
      const updatedMetrics = await sequelize.models.Plan_metrics.update(
        {
          subscribers_count: existingMetrics.subscribers_count + 1,
          revenue_generated: existingMetrics.revenue_generated + amount,
        },
        { where: { PlanId: planId } }
      );

      return updatedMetrics;
    } else {
      const newMetrics = await sequelize.models.Plan_metrics.create({
        PlanId: planId,
        subscribers_count: 1,
        revenue_generated: amount,
      });

      return newMetrics;
    }
  } catch (error) {
    console.error("Error updating plan_metrics:", error);
    throw error;
  }
};

module.exports = { updatePlanMetrics };
