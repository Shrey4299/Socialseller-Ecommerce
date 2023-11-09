const router = require("express").Router();
const defaultPageController = require("../controllers/default_page");
const defaultPageValidation = require("../middlewares/default_page");

module.exports = (app) => {
  router.get("/", defaultPageController.get);
  router.post(
    "/",
    defaultPageValidation.validateDefaultPage,
    defaultPageController.update
  );

  app.use("/api/default_pages", router);
};
