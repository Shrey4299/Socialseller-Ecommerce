
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Payment_log = sequelize.define("Payment_log", {
    order_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    amount_refunded: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    captured: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    card_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    card: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last4: {
      type: DataTypes.STRING,
      allowNull: true
    },
    network: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bank: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wallet: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vpa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });

  return Payment_log;
};
