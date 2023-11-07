// middlewares/database.js
const { requestError } = require('../services/errors');
const createDbConnection = require('../utils/dbConnection');

module.exports = async (req, res, next) => {
    // Access the subdomain from the request object
    const subdomain = req.subdomain;
    const sequelize = await createDbConnection(subdomain);
    if (!sequelize) return res.status(400).send(requestError({ message: "Invalid Site Address", details: "Requested subdomain not found" }))
    req.db = sequelize;
    let api = req.url.split("?")[0]
    req.api = api
    console.log(api)
    // console.log(process.pid)
    next();
};
