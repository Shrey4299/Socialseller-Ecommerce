const router = require("express").Router();
const custom_courierController = require("../controllers/custom_courier");

// Define routes for the "Custom_courier" resource
module.exports = (app) => {
  router.post("/", custom_courierController.create);
  router.get("/", custom_courierController.findAll);
  router.get("/:id", custom_courierController.findOne);
  router.put("/:id", custom_courierController.update);
  router.delete("/:id", custom_courierController.delete);
  app.use("/api/custom_courier", router);
};
