const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    UID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    paymentID: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentSignature: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    consumerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    consumerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    consumerEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isResellerOrder: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Processing", "Shipped", "Delivered"),
      allowNull: true,
    },
    payment_mode: {
      type: DataTypes.ENUM(
        "Credit Card",
        "Debit Card",
        "Cash on Delivery",
        "Wallet"
      ),
      allowNull: true,
    },
    rzpayOrderId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    statusUser: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: true,
    },
  });

  return Order;
};
