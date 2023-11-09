// controllers/transactionController.js

/**
 * Create a new transaction.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const transaction = await sequelize.models.Transaction.create(req.body);
    return res.status(200).send({
      message: "Transaction created successfully!",
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a transaction" });
  }
};

/**
 * Get a specific transaction by ID.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const transaction = await sequelize.models.Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    return res.status(200).send({ data: transaction });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch transaction" });
  }
};

/**
 * Get a specific transaction by ID.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const transaction = await sequelize.models.Transaction.findAll();

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    return res.status(200).send({ data: transaction });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch transaction" });
  }
};

/**
 * Update a transaction by ID.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const transaction = await sequelize.models.Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    await transaction.update(req.body);

    return res.status(200).send({
      message: "Transaction Updated Successfully!",
      data: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update transaction" });
  }
};

/**
 * Delete a transaction by ID.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const transaction = await sequelize.models.Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }

    await transaction.destroy();

    return res
      .status(200)
      .send({ message: "Transaction Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete transaction" });
  }
};
