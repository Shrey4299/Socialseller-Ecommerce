const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Plan = sequelize.define("Plan", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      require: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  return Plan;
};
