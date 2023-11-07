// relations for shared db 
const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define("Permission", {
    api: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true
    },
    method: {
      type: DataTypes.ENUM("GET", "POST", "PUT", "DELETE", "PATCH"),
    },
  });
  return Permission
}
