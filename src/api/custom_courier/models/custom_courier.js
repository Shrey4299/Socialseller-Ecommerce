const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Custom_courier = sequelize.define("Custom_courier", {
    image: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    trackingId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courierName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courierEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Custom_courier;
};
