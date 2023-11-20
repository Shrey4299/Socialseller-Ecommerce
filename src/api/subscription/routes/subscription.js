// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const subscriptionController = require("../controllers/subscription");
const orderController = require("../../order/controllers/order");
const {
  validateRequest,
  checkPlan,
  validateTags,
  checkExistingSubscription,
  validateUserSubscription,
} = require("../middlewares/subscription");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.get("/cashfreeVerify", subscriptionController.verifyCashfree);
  router.post("/checkoutCashfree", subscriptionController.createCashfreeOrder);
  router.post("/", [RBAC, validateRequest], subscriptionController.create);
  router.get("/", [validateTags], subscriptionController.find);
  router.get("/:id", [RBAC], subscriptionController.findOne);
  router.put("/:id", [RBAC], subscriptionController.update);
  router.delete("/:id", [RBAC], subscriptionController.delete);
  router.post(
    "/checkout",
    // [checkExistingSubscription, checkPlan],
    subscriptionController.checkOut
  );
  router.post("/verify", subscriptionController.verify);
  router.post("/webhooks", subscriptionController.webhook);
  router.post("/webhooksCashfree", subscriptionController.webhookCashfree);
  router.post("/order/cashfree/webhook", orderController.webhookCashfree);
  router.post("/order/razorpay/webhook", orderController.webhook);
  router.post("/order/verify", orderController.verify);

  router.put(
    "/:id/cancel",
    validateUserSubscription,
    subscriptionController.refund
  );
  app.use("/api/subscriptions", router);
};
