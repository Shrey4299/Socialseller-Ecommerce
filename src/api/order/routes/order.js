// src/api/post/postRoutes.js
const router = require("express").Router();
const ordersController = require("../controllers/order");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.get("/", ordersController.findAll);
  router.post("/", ordersController.create);
  router.post("/variant", ordersController.createVariantOrder);
  router.post("/checkout", ordersController.checkOut);
  router.post("/verify", ordersController.verify);
  app.use("/api/order", router);
};
