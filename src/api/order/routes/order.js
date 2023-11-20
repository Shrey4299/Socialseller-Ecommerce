// src/api/post/postRoutes.js
const router = require("express").Router();
const ordersController = require("../controllers/order");

module.exports = (app) => {
  router.post("/cashfreeCheckout", ordersController.createCashfreeOrder);
  router.get("/cashfreeVerify", ordersController.verifyCashfree);
  router.post("/webhooksCashfree", ordersController.webhookCashfree);

  router.get("/", ordersController.findAll);
  router.post("/", ordersController.create);

  router.post("/variant", ordersController.createVariantOrder);
  router.post("/checkout", ordersController.checkOut);
  router.post("/verify", ordersController.verify);


  app.use("/api/order", router);
};
