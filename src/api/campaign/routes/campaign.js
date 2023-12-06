const router = require("express").Router();
const campaignController = require("../controllers/campaign");
const StoreRABC = require("../../../middlewares/StoreRBAC");

module.exports = (app) => {
  // Define routes for the "Campaign" resource
  router.post("/", [StoreRABC], campaignController.create);
  router.put("/:id", campaignController.update);
  router.get("/", campaignController.findAll);
  router.get("/:id", campaignController.findOne);
  router.delete("/:id", campaignController.delete);

  // Use the router in the app
  app.use("/api/campaign", router);
};
