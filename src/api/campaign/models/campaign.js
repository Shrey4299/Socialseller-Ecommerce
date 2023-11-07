const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Campaign = sequelize.define("Campaign", {
    notification_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notification_body: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notification_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schedule_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(["link", "product", "collection"]),
      allowNull: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Campaign;
};
