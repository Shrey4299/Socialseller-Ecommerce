// routes/defaultPageRoutes.js
const router = require("express").Router();
const defaultPageController = require("../controllers/default_page");

module.exports = (app) => {
  router.post("/", defaultPageController.update);
  router.get("/", defaultPageController.get);

  app.use("/api/default_pages", router);
};
