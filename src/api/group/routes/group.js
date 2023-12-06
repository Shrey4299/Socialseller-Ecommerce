// src/api/group/groupRoutes.js
const router = require("express").Router();
const groupController = require("../controllers/group");
const StoreRABC = require("../../../middlewares/StoreRBAC");

// Define routes for the "Group" resource
module.exports = (app) => {
  router.post("/", StoreRABC, groupController.create);
  router.get("/", groupController.find);
  router.get("/:id", groupController.findOne);
  router.put("/:id", groupController.update);
  router.delete("/:id", groupController.delete);
  app.use("/api/groups", router);
};
