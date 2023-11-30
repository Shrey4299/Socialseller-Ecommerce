const router = require("express").Router();
const walletController = require("../controllers/wallet");

module.exports = (app) => {
  router.post("/", walletController.create);
  router.get("/", walletController.find);
  router.put("/update/:id", walletController.updateWallet);

  app.use("/api/wallets/", router);
};
