// routes/user_metricsRoutes.js
const router = require("express").Router();
const userMetricsController = require("../controllers/user_metrics");

module.exports = (app) => {
  router.post("/", userMetricsController.create);
  router.get("/", userMetricsController.find);
  router.get("/:id", userMetricsController.findOne);
  router.put("/:id", userMetricsController.update);
  router.delete("/:id", userMetricsController.delete);

  app.use("/api/user_metrics", router);
};
