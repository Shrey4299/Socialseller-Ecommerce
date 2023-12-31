// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const leadController = require("../controllers/lead");
const { validateRequest } = require("../middlewares/lead");
const StoreRABC = require("../../../middlewares/StoreRBAC");


// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/leads/", leadController.create);
  router.get("/leads/", leadController.find);
  router.get("/leads/:id", [RBAC], leadController.findOne);
  router.put("/leads/:id", [RBAC], leadController.update);
  router.delete("/leads/:id", [RBAC], leadController.delete);
  router.get("/search/leads/", [RBAC], leadController.search);
  app.use("/api", router);
};
