const router = require("express").Router();
const product_matricsController = require("../controllers/product_metrics");
const { validateProductMetrics } = require("../middlewares/product_metrics");

module.exports = (app) => {
  router.post(
    "/product_metrics/",
    validateProductMetrics,
    product_matricsController.create
  );
  router.get("/product_metrics/", product_matricsController.find);
  router.get("/product_metrics/:id", product_matricsController.findOne);
  router.put("/product_metrics/:id", product_matricsController.update);
  router.delete("/product_metrics/:id", product_matricsController.delete);

  app.use("/api", router);
};
