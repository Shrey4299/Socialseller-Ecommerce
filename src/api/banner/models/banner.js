
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // Define the Post model using the provided Sequelize instance
  const Banner = sequelize.define("Banner", {
    action: {
      type: DataTypes.ENUM(["CALL", "LINK", "WHATSAPP"]),
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    whats_app: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  return Banner;
};
