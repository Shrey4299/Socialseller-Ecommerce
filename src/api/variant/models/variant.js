const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Variant = sequelize.define("Variant", {
    name: {
      type: DataTypes.STRING,
      require: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      require: true,
    },
    from: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    to: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      require: true,
    },
    // is_active: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true
    // },
  });

  return Variant;
};
