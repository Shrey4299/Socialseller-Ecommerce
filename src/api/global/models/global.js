const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Global = sequelize.define(
    "Global",
    {
      RAZORPAY_KEY_ID: {
        type: DataTypes.STRING,
      },
      RAZORPAY_KEY_SECRET: {
        type: DataTypes.STRING,
      },
      RAZORPAY_WEBHOOK_SECRETE: {
        type: DataTypes.STRING,
      },
      CASHFREE_KEY_ID: {
        type: DataTypes.STRING,
      },
      CASHFREE_KEY_SECRET: {
        // Updated field name
        type: DataTypes.STRING,
      },
      PAYMENT_GATEWAY: {
        type: DataTypes.ENUM(["RAZORPAY", "PHONEPE", "CASHFREE"]),
      },
      GOOGLE_CLIENT_ID: {
        type: DataTypes.STRING,
      },
      GOOGLE_CLIENT_SECRET: {
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
  return Global;
};
