const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collection");
const collectionMiddleware = require("../middlewares/collection");
const StoreRABC = require("../../../middlewares/StoreRBAC");

router.post(
  "/",
  [StoreRABC, collectionMiddleware.validateCollection],
  collectionController.create
);
router.put(
  "/:id",
  collectionMiddleware.validateCollection,
  collectionController.update
);
router.get("/", collectionController.findAll);
router.get("/:id", collectionController.findOne);
router.delete("/:id", collectionController.delete);
router.get("/:id/products", collectionController.getProductsFromCollection);
router.get(
  "/:id/products/search",
  collectionController.searchProductsInCollection
);

module.exports = (app) => {
  app.use("/api/collection", router);
};
