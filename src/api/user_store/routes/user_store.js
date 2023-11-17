const express = require("express");
const router = express.Router();
const userStoreController = require("../controllers/user_store");
const userStoreMiddleware = require("../middlewares/user_store");

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
  router.get("/", userStoreController.findAll);
  router.get("/:id", userStoreController.findOne);
  router.delete("/:id", userStoreController.delete);

  app.use("/api/user_store", router); // Adjust the route here
};
