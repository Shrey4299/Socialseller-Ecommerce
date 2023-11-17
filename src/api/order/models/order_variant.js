const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order_variant = sequelize.define("Order_variant", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Order_variant;
};
