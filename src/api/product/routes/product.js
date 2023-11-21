// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const productController = require("../controllers/product");
const Joi = require("../middlewares/product");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/products/", productController.create);
  router.get("/products/", productController.find);
  router.get("/products/:id", [RBAC], productController.findOne);
  router.put(
    "/products/:id",
    [RBAC, Joi.validateUpdateBody],
    productController.update
  );
  router.delete("/products/:id", [RBAC], productController.delete);
  router.get(
    "/search/products",
    [Joi.queryValidator],
    productController.search
  );
  router.get(
    "/products/filter/price",
    [RBAC, Joi.filterValidator],
    productController.findByPrice
  );
  app.use("/api", router);
};
