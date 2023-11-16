// models/sub_category.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sub_category = sequelize.define(
    "Sub_category",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["id"],
        },
      ],
    }
  );


  return Sub_category;
};
