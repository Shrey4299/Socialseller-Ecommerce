// Controller function to create a new post
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
