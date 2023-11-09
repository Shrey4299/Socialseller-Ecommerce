// models/user_metrics.js
const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User_metrics = sequelize.define("User_metrics", {
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    login_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_login_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscription_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    total_spendings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return User_metrics;
};
