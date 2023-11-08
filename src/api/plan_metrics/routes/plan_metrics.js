// src/api/plan_metrics/plan_metricsRoutes.js
const router = require("express").Router();
const planMetricsController = require("../controllers/plan_metrics");

// Define routes for the "Plan_metrics" resource
module.exports = (app) => {
  router.post("/", planMetricsController.create);
  router.get("/", planMetricsController.find);
  router.get("/:id", planMetricsController.findOne);
  router.put("/:id", planMetricsController.update);
  router.delete("/:id", planMetricsController.delete);

  app.use("/api/plan_metrics", router);
};
