// models/mainDbModels/User.js
const { Sequelize, DataTypes, } = require('sequelize');



module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            require: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            require: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        port: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        database: {
            type: DataTypes.STRING,
            allowNull: true
        },
        host: {
            type: DataTypes.STRING,
            allowNull: true
        },
        db_username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subdomain: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },

    });
    return User
};
