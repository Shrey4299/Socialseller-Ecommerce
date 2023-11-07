
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Subscription = sequelize.define("Subscription", {
    order_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    purchaseType: {
      type: DataTypes.ENUM(["ONLINE", "CASH"]),
      allowNull: true
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valid_to: {
      type: DataTypes.DATE,
      allowNull: false,

    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM(["ACTIVE", "REFUNDED", "EXPIRED"])
    }
  });

  return Subscription;
};
