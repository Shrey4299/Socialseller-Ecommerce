const router = require("express").Router();
const storeSettingController = require("../controllers/store_setting");

module.exports = (app) => {
  router.post("/", storeSettingController.create);
  router.get("/", storeSettingController.find);

  app.use("/api/store_setting", router);
};
