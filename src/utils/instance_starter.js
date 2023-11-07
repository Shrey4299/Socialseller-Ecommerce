const dbCache = require('./dbCache');
const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/db.config');
const mainDbRelation = require('./mainDbRelation');

module.exports = async () => {
    console.log("function")
    if (dbCache.get("main_instance") === undefined) {
        console.log("creating instance of main db")
        const mainDb = {};
        const sequelize = new Sequelize(dbConfig)
        mainDb.sequelize = await mainDbRelation(sequelize)

        dbCache.set("main_instance", mainDb.sequelize)
        await mainDb.sequelize.sync({ alter: true })
    } else {
        console.log("already db main db cached!")
    }
}