const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CustomerCourier = sequelize.define("Customer_courier", {
    image: {
      type: DataTypes.STRING, // Assuming you're storing the image path as a string
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



  return CustomerCourier;
};
