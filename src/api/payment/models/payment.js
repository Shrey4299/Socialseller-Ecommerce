// relations for shared db
const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const Payment = sequelize.define("Payment", {
    payment_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    card_id: DataTypes.STRING,
    card: {
      type: DataTypes.JSONB, // JSONB is used to store JSON data in PostgreSQL
    },
    bank: DataTypes.STRING,
    wallet: DataTypes.STRING,
    vpa: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.STRING,
    error_code: DataTypes.STRING,
    error_description: DataTypes.STRING,
    acquirer_data: DataTypes.JSONB,
    upi: DataTypes.JSONB,
    base_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Payment;
};
