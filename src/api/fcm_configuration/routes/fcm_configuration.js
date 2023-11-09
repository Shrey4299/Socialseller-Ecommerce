const router = require("express").Router();
const fcmConfigController = require("../controllers/fcm_configuration");
const fcmConfigValidation = require("../middlewares/fcm_configuration");

module.exports = (app) => {
  router.post(
    "/",
    [fcmConfigValidation.validateFCMConfig],
    fcmConfigController.update
  );

  router.get("/", fcmConfigController.get);

  app.use("/api/fcm_configuration", router);
};
