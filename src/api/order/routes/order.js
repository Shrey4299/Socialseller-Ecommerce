// src/api/post/postRoutes.js
const router = require("express").Router();
const ordersController = require("../controllers/order");

module.exports = (app) => {
  router.post("/checkout/cashfree", ordersController.createCashfreeOrder);
  router.get("/verify/cashfree", ordersController.verifyCashfree);
  router.post("/webhook/cashfree", ordersController.webhookCashfree);

  router.get("/", ordersController.findAll);
  router.post("/", ordersController.create);
  router.post("/variant", ordersController.createVariantOrder);

  router.post("/checkout/razorpay", ordersController.checkOut);
  router.post("/verify/razorpay", ordersController.verify);

  app.use("/api/order", router);
};
