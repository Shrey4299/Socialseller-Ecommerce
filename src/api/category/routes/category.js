// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const categoryController = require("../controllers/category");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/", categoryController.create);
  router.get("/", categoryController.find);
  router.get("/:id", categoryController.findOne);
  router.put("/:id", categoryController.update);
  router.delete("/:id", categoryController.delete);
  router.get("/:id/products", categoryController.getProducts);
  router.get("/:id/products/search", categoryController.searchInCategory);
  app.use("/api/categories", router);
};
