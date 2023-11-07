const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Bulk_pricing = sequelize.define("Bulk_pricing", {
    from: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    premiumPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Bulk_pricing;
};
