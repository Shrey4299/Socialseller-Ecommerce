const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address");
const addressMiddleware = require("../middlewares/address");

router.post("/", addressMiddleware.validateAddress, addressController.create);
router.put("/:id", addressMiddleware.validateAddress, addressController.update);
router.get("/", addressController.findAll);
router.get("/:id", addressController.findOne);
router.delete("/:id", addressController.delete);

module.exports = (app) => {
  app.use("/api/address", router);
};
