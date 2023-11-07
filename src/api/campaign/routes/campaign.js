const router = require("express").Router();
const campaignController = require("../controllers/campaign");

module.exports = (app) => {
  // Define routes for the "Campaign" resource
  router.post("/", campaignController.create);
  router.put("/:id", campaignController.update);
  router.get("/", campaignController.findAll);
  router.get("/:id", campaignController.findOne);
  router.delete("/:id", campaignController.delete);

  // Use the router in the app
  app.use("/api/campaign", router);
};
