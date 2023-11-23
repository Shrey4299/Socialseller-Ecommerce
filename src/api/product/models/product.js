const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },

    shipping_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    shipping_value_type: {
      type: DataTypes.ENUM(
        "SHIPPING_PRICE",
        "SHIPPING_PERCENTAGE",
        "FREE_SHIPPING"
      ),
      allowNull: false,
    },
  });

  return Product;
};
