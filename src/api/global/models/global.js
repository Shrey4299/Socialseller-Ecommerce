const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Global = sequelize.define(
    "Global",
    {
      
      subscriptionPrice: {
        type: DataTypes.INTEGER,
      },
      codPrepaidAmount: {
        type: DataTypes.INTEGER,
      },
      shippingPrice: {
        type: DataTypes.INTEGER,
      },
      razorpayKey: {
        type: DataTypes.STRING,
      },
      razorpaySecret: {
        type: DataTypes.STRING,
      },
      withdrawLimit: {
        type: DataTypes.INTEGER,
      },
      razorpayXAccountNumber: {
        type: DataTypes.STRING,
      },
      shiprocket_username: {
        type: DataTypes.STRING,
      },
      shiprocket_password: {
        type: DataTypes.STRING,
      },
      is_shiprocket_enabled: {
        type: DataTypes.BOOLEAN,
      },
      token: {
        type: DataTypes.STRING,
      },
      selected_payment_gateway: {
        type: DataTypes.ENUM("RAZORPAY", "CASHFREE", "PHONEPE", "NONE"),
      },
      cashfree_client_secret: {
        type: DataTypes.STRING,
      },
      cashfree_client_id: {
        type: DataTypes.STRING,
      },
      phonepe_merchant_id: {
        type: DataTypes.STRING,
      },
      phonepe_merchant_key: {
        type: DataTypes.STRING,
      },
      phonepe_key_index: {
        type: DataTypes.STRING,
      },
      firebase_auth: {
        type: DataTypes.JSON,
      },
      user_verification_method: {
        type: DataTypes.ENUM("FIREBASE", "MSG91"),
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
