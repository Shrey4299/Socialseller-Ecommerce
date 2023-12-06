const router = require("express").Router();
const walletController = require("../controllers/wallet");
const StoreRABC = require("../../../middlewares/StoreRBAC");


module.exports = (app) => {
  router.post("/", StoreRABC, walletController.create);
  router.get("/", walletController.find);
  router.put("/update/:id", StoreRABC, walletController.updateWallet);

  app.use("/api/wallets/", router);
};
