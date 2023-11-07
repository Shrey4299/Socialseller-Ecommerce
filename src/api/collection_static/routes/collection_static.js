const router = require("express").Router();
const collectionStaticController = require("../controllers/collection_static");
const collectionStaticMiddleware = require("../middlewares/collection_static");

module.exports = (app) => {
  router.post(
    "/",
    collectionStaticMiddleware,
    collectionStaticController.create
  );
  router.get("/", collectionStaticController.find);
  router.put(
    "/:id",
    collectionStaticMiddleware,
    collectionStaticController.update
  );
  router.delete("/:id", collectionStaticController.delete);

  router.get("/:id/products", collectionStaticController.getProducts);

  app.use("/api/collection_static", router);
};
