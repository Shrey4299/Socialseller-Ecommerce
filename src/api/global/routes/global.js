// src/api/post/postRoutes.js
const router = require("express").Router();
const globalController = require("../controllers/global");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/", globalController.create);
  router.get("/", globalController.find);

  app.use("/api/globals", router);
};
