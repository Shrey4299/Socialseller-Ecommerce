// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const variant = require("../controllers/variant");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/", [RBAC], variant.create);
  router.get("/", variant.find);
  router.get("/:id", [RBAC], variant.findOne);
  router.put("/:id", [RBAC], variant.update);
  router.delete("/:id", [RBAC], variant.delete);
  app.use("/api/variants", router);
};
