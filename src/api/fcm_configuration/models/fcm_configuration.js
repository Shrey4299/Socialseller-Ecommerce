// models/FCM_Configuration.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FCM_configuration = sequelize.define(
    "FCM_configuration",
    {
      serviceAccount: {
        type: DataTypes.JSON,
      },
      devicesTokensCollectionName: {
        type: DataTypes.STRING,
      },
      deviceTokenFieldName: {
        type: DataTypes.STRING,
      },
      deviceLabelFieldName: {
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
  return FCM_configuration;
};
