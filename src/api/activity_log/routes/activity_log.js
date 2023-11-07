const express = require("express");
const router = express.Router();
const activityLogController = require("../controllers/activity_log");
const activityLogMiddleware = require("../middlewares/activity_log");

router.post(
  "/",
  activityLogMiddleware.validateActivityLog,
  activityLogController.create
);
router.put(
  "/:id",
  activityLogMiddleware.validateActivityLog,
  activityLogController.update
);
router.get("/", activityLogController.findAll);
router.get("/:id", activityLogController.findOne);
router.delete("/:id", activityLogController.delete);

module.exports = (app) => {
  app.use("/api/activity_log", router);
};
