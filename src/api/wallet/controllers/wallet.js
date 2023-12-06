// Controller function to create a new post
const createActivityLog = require("../../../services/createActivityLog");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.create = async (req, res) => {
  try {
    const wallet = await req.db.models.Wallet.create(req.body);
    return res
      .status(200)
      .send({ message: "Wallet created successfully!", data: wallet });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create wallet" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const Wallet = sequelize.models.Wallet;
    const wallets = await Wallet.findAll();

    return res.status(200).send(wallets);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch wallets" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.updateWallet = async (req, res) => {
  try {
    const userStore = await req.db.models.User_store.findOne({
      where: { id: req.params.id },
    });

    if (req.body.transaction_type == "DEBIT") {
      console.log("entering CREDIT transaction");
      await userStore.update({
        wallet_balance: userStore.wallet_balance + req.body.wallet_balance,
      });

      const walletDebitActivityLog = await createActivityLog.createActivityLog(
        req,
        res,
        "WALLET_DEBIT",
        "wallet debited successfully!"
      );
    } else {
      await userStore.update({
        wallet_balance: userStore.wallet_balance - req.body.wallet_balance,
      });
      const walletDebitActivityLog = await createActivityLog.createActivityLog(
        req,
        res,
        "WALLET_CREDIT",
        "wallet credited successfully!"
      );
    }

    return res
      .status(200)
      .send({ message: "Wallet updated successfully!", data: userStore });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update wallet" });
  }
};
