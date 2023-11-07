
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Contact_us = sequelize.define("Contact_us", {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.STRING,
    },
  });

  return Contact_us;
};
