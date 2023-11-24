// src/api/order/orderRoutes.js
const router = require("express").Router();
const ordersController = require("../controllers/order_variant");

module.exports = (app) => {
  router.post("/", ordersController.createOrderVariant);
  router.get("/", ordersController.getAllOrderVariants);
  router.get("/:id", ordersController.getOrderVariant);
  router.put("/:id", ordersController.updateOrderVariant);
  router.delete("/:id", ordersController.deleteOrderVariant);

  router.get("/:id/variants", ordersController.getAllOrderVariantsByOrderId);

  router.put(
    "/:orderId/variants/:variantId/return_request",
    ordersController.updateReturnStatus
  );

  app.use("/api/order_variant", router);
};
