
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Store_info = sequelize.define("Store_info", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Store_info;
};
