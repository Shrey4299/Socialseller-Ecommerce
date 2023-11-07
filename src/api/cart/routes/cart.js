const express = require("express");
const router = express.Router();

const cartsController = require("../controllers/cart");
const cartValidationMiddleware = require("../middlewares/cart");

module.exports = (app) => {
  router.post("/", cartsController.create);
  router.get("/", cartsController.find);
  router.get(
    "/:cartId",
    cartValidationMiddleware.validateFindOneRequest,
    cartsController.findOne
  );
  router.post(
    "/:cartId/variants",
    cartValidationMiddleware.validateAddToCartRequest,
    cartsController.addToCart
  );
  router.get("/users/:userId/cartVariants", cartsController.findUserCart);
  // router.delete(
  //   "/:cartId/variants",
  //   cartsController.emptyCart
  // );
  // router.delete(
  //   "/:cartId/variants",
  //   cartValidationMiddleware.validateEmptyCartRequest,
  //   cartsController.deleteVariant
  // );

  router.delete(
    "/:cartId/variants/:variantId?",
    cartValidationMiddleware.validateDeleteVariantRequest,
    cartsController.deleteVariant
  );
  app.use("/api/cart", router);
};
