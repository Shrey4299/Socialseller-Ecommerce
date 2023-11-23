const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    order_id: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM(
        "new",
        "accepted",
        "pending",
        "delivered",
        "cancelled"
      ),
    },
    payment: {
      type: DataTypes.ENUM("COD", "prepaid"),
    },
    address: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
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
