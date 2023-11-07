// src/api/store_setting/storeSettingRoutes.js
const router = require("express").Router();
const storeSettingController = require("../controllers/store_setting");

// Define routes for the "Store_setting" resource
module.exports = (app) => {
  router.post("/", storeSettingController.create);
  router.get("/", storeSettingController.find);

  app.use("/api/store_setting", router);
};
