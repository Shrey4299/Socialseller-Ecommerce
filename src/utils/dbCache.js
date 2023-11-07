const nodeCache = require("node-cache");
const dbCache = new nodeCache({ stdTTL: 1000 });

module.exports = dbCache;
