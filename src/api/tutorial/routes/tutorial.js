const express = require("express");
const router = express.Router();
const tutorialController = require("../controllers/tutorial");
const tutorialMiddleware = require("../middlewares/tutorial");
const StoreRABC = require("../../../middlewares/StoreRBAC");


module.exports = (app) => {
  router.post(
    "/",
    StoreRABC,
    tutorialMiddleware.validateTutorial,
    tutorialController.create
  );
  router.put(
    "/:id",
    tutorialMiddleware.validateTutorial,
    tutorialController.update
  );
  router.get("/", tutorialController.findAll);
  router.get("/:id", tutorialController.findOne);
  router.delete("/:id", tutorialController.delete);

  app.use("/api/tutorial", router);
};
