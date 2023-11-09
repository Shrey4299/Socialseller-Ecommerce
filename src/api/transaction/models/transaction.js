// models/transaction.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Transaction = sequelize.define("Transaction", {
    purpose: {
      type: DataTypes.ENUM("PURCHASE", "REFUND", "ADDED_TO_WALLET"),
      allowNull: false,
    },
    txn_type: {
      type: DataTypes.ENUM("DEBIT", "CREDIT"),
      allowNull: false,
    },
    txn_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mode: {
      type: DataTypes.ENUM("WALLET", "MONEY"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Transaction;
};
