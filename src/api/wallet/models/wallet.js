const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Wallet = sequelize.define("Wallet", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("DEPOSIT", "WITHDRAWAL"),
      allowNull: false,
    },
    reasons: {
      type: DataTypes.ENUM("PURCHASE", "WITHDRAWAL", "ADDITION", "PAYOUT_SENT"),
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    proof: {
      type: DataTypes.STRING, // Assuming the proof is stored as a file path or URL
      allowNull: true,
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Wallet;
};
