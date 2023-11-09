const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Global_brand = sequelize.define(
    "Global_brand",
    {
      name: {
        type: DataTypes.STRING,
      },
      logo: {
        type: DataTypes.STRING, // Assuming you store the file path or URL to the logo
      },
      tagline: {
        type: DataTypes.STRING,
      },
      whatsapp_number: {
        type: DataTypes.STRING,
      },
      calling_number: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
      },
      about_us: {
        type: DataTypes.TEXT,
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
  return Global_brand;
};
