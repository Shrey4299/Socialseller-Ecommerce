const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collection");
const collectionMiddleware = require("../middlewares/collection");

router.post(
  "/",
  collectionMiddleware.validateCollection,
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

module.exports = (app) => {
  app.use("/api/collection", router);
};
