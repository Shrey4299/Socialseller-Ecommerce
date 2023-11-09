const router = require("express").Router();
const freePlanController = require("../controllers/free_plan");
const freePlanValidation = require("../middlewares/free_plan");

module.exports = (app) => {
  router.post(
    "/",
    [freePlanValidation.validateFreePlan],
    freePlanController.update
  );

  router.get("/", freePlanController.get);

  app.use("/api/free_plan", router);
};
