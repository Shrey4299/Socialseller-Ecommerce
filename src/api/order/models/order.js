const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    order_id: {
      type: DataTypes.STRING,
    },
    payment_order_id: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    payment: {
      type: DataTypes.ENUM("COD", "prepaid", "wallet"),
    },
    payment_id: {
      type: DataTypes.STRING,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
    },
  });

  return Order;
};
