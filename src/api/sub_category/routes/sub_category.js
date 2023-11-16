// routes/subCategoryRoutes.js
const router = require("express").Router();
const subCategoryController = require("../controllers/sub_category");

module.exports = (app) => {
  router.post("/", subCategoryController.create);
  router.put("/:id", subCategoryController.update);
  router.get("/", subCategoryController.get);
  router.get("/:id", subCategoryController.getById);
  router.delete("/:id", subCategoryController.remove);

  app.use("/api/sub_categories", router);
};
