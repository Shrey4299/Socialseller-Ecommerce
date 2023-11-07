// routes/fcmConfigurationRoutes.js
const router = require("express").Router();
const fcmConfigController = require("../controllers/fcm_configuration");

module.exports = (app) => {
  router.post("/", fcmConfigController.update);
  router.get("/", fcmConfigController.get);

  app.use("/api/fcm_configuration", router);
};
