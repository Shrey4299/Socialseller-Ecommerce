
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
    },
  });

  // Define associations or additional methods as needed

  return Category;
};
