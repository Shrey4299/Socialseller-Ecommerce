// src/api/global_brand/globalBrandRoutes.js
const router = require("express").Router();
const globalBrandController = require("../controllers/global_brand");

// Define routes for the "Global_brand" resource
module.exports = (app) => {
  router.post("/", globalBrandController.create);
  router.get("/", globalBrandController.find);

  app.use("/api/global_brands", router);
};
