const express = require("express");
const router = express.Router();
const userStoreController = require("../controllers/user_store");
const userStoreMiddleware = require("../middlewares/user_store");
const StoreRBCA = require("../../../middlewares/StoreRBAC");

module.exports = (app) => {
  router.post(
    "/",
    userStoreMiddleware.validateUserStore,
    userStoreController.create
  );
  router.put(
    "/:id",
    userStoreMiddleware.validateUserStore,
    userStoreController.update
  );
  router.get("/", [StoreRBCA], userStoreController.findAll);
  router.get("/me", userStoreController.getMe);
  router.get("/search", userStoreController.search);
  router.get("/:id", userStoreController.findOne);
  router.delete("/:id", userStoreController.delete);
  router.post("/login", userStoreController.login);

  app.use("/api/user_store", router);
};
