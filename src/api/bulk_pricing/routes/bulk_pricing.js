const express = require("express");
const router = express.Router();
const bulkPricingController = require("../controllers/bulk_pricing");
const bulkPricingMiddleware = require("../middlewares/bulk_pricing");

router.post(
  "/",
  bulkPricingMiddleware.validateBulkPricing,
  bulkPricingController.create
);
router.put(
  "/:id",
  bulkPricingMiddleware.validateBulkPricing,
  bulkPricingController.update
);
router.get("/", bulkPricingController.findAll);
router.get("/:id", bulkPricingController.findOne);
router.delete("/:id", bulkPricingController.delete);

module.exports = (app) => {
  app.use("/api/bulk_pricing", router);
};
