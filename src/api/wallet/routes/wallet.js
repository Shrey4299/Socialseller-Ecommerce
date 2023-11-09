const router = require("express").Router();
const walletController = require("../controllers/wallet");

module.exports = (app) => {
  router.post("/wallets/", walletController.create);
  router.get("/wallets/", walletController.find);

  app.use("/api", router);
};
