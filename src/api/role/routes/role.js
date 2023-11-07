// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const roleController = require("../controllers/role");
const Joi = require("../middlewares/role");

// router.use(api_access)
// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/", [Joi.validateCreateBody], roleController.create);
  router.get("/", roleController.find);
  router.get("/:id", RBAC, roleController.findOne);
  router.put("/:id", RBAC, roleController.update);
  router.delete("/:id", RBAC, roleController.delete);
  app.use("/api/roles", router);
};
