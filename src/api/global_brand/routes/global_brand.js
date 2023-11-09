const router = require("express").Router();
const globalBrandController = require("../controllers/global_brand");
const globalBrandMiddleware = require("../middlewares/global_brand"); // Require the middleware

module.exports = (app) => {
  router.post(
    "/",
    globalBrandMiddleware.validateRequest,
    globalBrandController.create
  );
  router.get("/", globalBrandController.find);

  app.use("/api/global_brands", router);
};
