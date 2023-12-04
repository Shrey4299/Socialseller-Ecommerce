// src/api/post/postRoutes.js
const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const store_RBAC = require("../../../middlewares/StoreRBAC");
const productController = require("../controllers/product");
const Joi = require("../middlewares/product");

// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/products/", [store_RBAC], productController.create);
  router.get("/products/", productController.find);
  router.get("/products/:id", productController.findOne);
  router.put(
    "/products/:id",
    [store_RBAC, Joi.validateUpdateBody],
    productController.update
  );
  router.delete("/products/:id", [store_RBAC], productController.delete);
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
  router.get("/products/:n/random", productController.findNRandom);
  router.get("/products/:n/random/category/:id", productController.findNRandom);

  app.use("/api", router);
};
