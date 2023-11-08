const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Define the Lead model using the provided Sequelize instance
  const Lead = sequelize.define("Lead", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "NEW",
        "ASSIGNED",
        "CALLING",
        "CALLED",
        "CONVERTED",
        "COMPLETED"
      ),
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM(
        "WHATSAPP",
        "INSTAGRAM",
        "SOCIAL_SELLER_WEBSITE",
        "YOUTUBE_CHANNEL",
        "APP",
        "WEBSITE"
      ),
      allowNull: true,
    },
    consumer_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    staff_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Lead;
};
