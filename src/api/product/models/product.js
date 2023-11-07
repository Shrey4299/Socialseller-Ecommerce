const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {

  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      require: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
  });

  return Product;
};
