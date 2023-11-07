const { Sequelize } = require("sequelize");
const { getConfigs } = require("./getConnectionConfig"); // Import the function you created earlier
const dbCache = require("./dbCache");

const relation = require("./relation");
const mainDbRelation = require("./mainDbRelation");
const dbConfig = require("../../config/db.config");

module.exports = async (subdomain) => {
  if (subdomain === null) {
    if (dbCache.get("main_instance")) {
      console.log("getting main instance from cache");
      return dbCache.get("main_instance");
    } else {
      console.log("creating main instance ");
      const mainDb = {};
      const sequelize = new Sequelize(dbConfig);
      mainDb.sequelize = await mainDbRelation(sequelize);
      dbCache.set("main_instance", mainDb.sequelize);
      await mainDb.sequelize.sync({ alter: true });
      return mainDb.sequelize;
    }
  } else {
    if (dbCache.get(subdomain) !== undefined) {
      console.log("getting subd instance from cache");
      const sequelize = dbCache.get(subdomain);
      return sequelize;
    } else {
      console.log("creating subd instance ");
      const db = {};

      const sequelize = new Sequelize(dbConfig);

      const config = await getConfigs(subdomain, sequelize);

      if (config === null) return false;
      else {
        const sequelize = new Sequelize({
          dialect: "postgres",
          host: "localhost",
          port: 5432,
          username: "postgres",
          password: "Sonu619@",
          database: config.database,
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
          logging: false,
        });
        db.sequelize = await relation(sequelize);
        dbCache.set(subdomain, db.sequelize);
        await db.sequelize.sync({ alter: true });
        return db.sequelize;
      }
    }
  }
};
