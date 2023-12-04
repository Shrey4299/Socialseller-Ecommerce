// src/api/post/postRoutes.js
const router = require("express").Router();
const ordersController = require("../controllers/order");
const ordersMiddlware = require("../middlewares/order");
const StoreRABC = require("../../../middlewares/StoreRBAC");

module.exports = (app) => {
  router.post(
    "/checkout/cashfree",
    [StoreRABC],
    ordersController.createCashfreeOrder
  );
  router.get("/verify/cashfree", ordersController.verifyCashfree);
  router.post("/webhook/cashfree", ordersController.webhookCashfree);

  router.get("/", [StoreRABC], ordersController.findAll);
  router.post("/", ordersController.create);
  router.get("/search", ordersController.searchOrders);

  router.get("/:id", ordersController.findOne);
  router.put("/:id", ordersController.update);

  router.post(
    "/checkout/razorpay",
    [StoreRABC, ordersMiddlware.validateRequest],
    ordersController.checkOut
  );
  router.post("/verify/razorpay", ordersController.verify);

  router.put("/:id/accept", ordersController.acceptOrder);
  router.put("/:id/cancel", ordersController.cancelOrder);
  router.put("/:id/deliver", ordersController.deliverOrder);
  router.get("/status/:status", ordersController.getOrdersByStatus);

  app.use("/api/orders", router);
};
