// src/api/post/postRoutes.js
const router = require("express").Router();
const uploadController = require("../controllers/upload");
const upload = require("../../../services/fileUploader");
const { fileFormat } = require("../middlewares/upload");
// Define routes for the "Post" resource
module.exports = (app) => {
  router.post("/", [upload.single("file")], uploadController.create);
  router.get("/", uploadController.find);
  router.get("/:id", uploadController.findOne);
  router.put("/:id", [fileFormat], uploadController.update);
  router.delete("/:id", uploadController.delete);
  app.use("/api/uploads", router);
};
