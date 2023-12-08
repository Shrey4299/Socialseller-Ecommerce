const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product_metrics = sequelize.define("Product_metrics", {
    view_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ordered_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shares_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    revenue_generated: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Product_metrics;
};
