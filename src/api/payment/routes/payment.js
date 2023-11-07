const router = require("express").Router();
const paymentController = require("../controllers/payment");
const validatePaymentData = require("../middlewares/payment");

module.exports = (app) => {
  router.post("/", validatePaymentData, paymentController.create);
  router.get("/", paymentController.find);
  router.get("/:id", paymentController.findOne); // New route for getting a single payment
  router.put("/:id", paymentController.update); // New route for updating a payment
  router.delete("/:id", paymentController.delete); // New route for deleting a payment

  app.use("/api/payments", router);
};
