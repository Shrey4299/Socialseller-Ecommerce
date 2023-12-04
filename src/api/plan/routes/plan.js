// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const StoreRBAC = require("../../../middlewares/StoreRBAC");
const planController = require("../controllers/plan");
const plan = require("../middlewares/plan");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/", [RBAC], planController.create);
  router.get("/", planController.find);
  router.get("/:id", planController.findOne);
  router.put("/:id", [RBAC, plan.validateUpdateRequest], planController.update);
  router.delete("/:id", [RBAC], planController.delete);
  app.use("/api/plans", router);
};
