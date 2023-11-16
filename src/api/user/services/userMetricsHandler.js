// userMetricsHandler.js

const { Sequelize } = require("sequelize");

const createUserMetrics = async (sequelize, userId) => {
  try {
    const UserMetrics = sequelize.models.User_metrics;

    // Check if user metrics for the given user already exist
    const existingMetrics = await UserMetrics.findOne({
      where: { UserId: userId },
    });

    if (existingMetrics) {
      // If user metrics exist, update them (e.g., increment login_count)
      const updatedMetrics = await UserMetrics.update(
        {
          login_count: existingMetrics.login_count + 1,
          last_login_date: new Date(),
          // Add other metrics updates as needed
        },
        { where: { UserId: userId } }
      );

      return updatedMetrics;
    } else {
      // If user metrics don't exist, create a new entry
      const newMetrics = await UserMetrics.create({
        UserId: userId,
        login_count: 1,
        registration_date: new Date(),
        last_login_date: new Date(),
        // Add other metrics values as needed
      });

      return newMetrics;
    }
  } catch (error) {
    console.error("Error updating user_metrics:", error);
    throw error;
  }
};

module.exports = { createUserMetrics };
