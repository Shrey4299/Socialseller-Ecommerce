// routes/freePlanRoutes.js
const router = require("express").Router();
const freePlanController = require("../controllers/free_plan");

module.exports = (app) => {
  router.post("/", freePlanController.update);
  router.get("/", freePlanController.get);

  app.use("/api/free_plan", router);
};
