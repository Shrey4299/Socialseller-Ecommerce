// api/transaction/transactionRoutes.js

const router = require("express").Router();
const transactionController = require("../controllers/transaction");
const { validateRequest } = require("../middlewares/transaction");

module.exports = (app) => {
  router.post("/transactions", [validateRequest], transactionController.create);
  router.get("/transactions", transactionController.find);
  router.get("/transactions/:id", transactionController.findOne);
  router.put("/transactions/:id", transactionController.update);
  router.delete("/transactions/:id", transactionController.delete);

  app.use("/api", router);
};
