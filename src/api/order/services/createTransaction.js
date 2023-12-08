const jwt = require("../../../services/jwt");
const crypto = require("crypto");
const { tokenError, requestError } = require("../../../services/errors");
const dbCache = require("../../../utils/dbCache");

exports.createTransaction = async (
  req,
  res,
  client,
  purpose,
  txnType,
  txnId,
  remark,
  mode,
  amount,
  transaction // Add transaction parameter
) => {
  try {
    const subdomain = client;
    const sequelize = dbCache.get(subdomain);
    if (!sequelize) {
      throw requestError({
        message: "Invalid Site Address",
        details: "Requested subdomain not found",
      });
    }
    const token = jwt.verify(req);
    if (token.error) {
      return res.status(401).send(tokenError(token));
    }
    const findUser = await sequelize.models.User_store.findByPk(token.id);

    if (!findUser) {
      return res.status(400).send(
        requestError({
          message: "Invalid Data!",
          details: "Invalid payload data found in token!",
        })
      );
    }
    const userId = findUser.id;

    const transactionData = {
      purpose,
      txn_type: txnType,
      txn_id: txnId,
      remark,
      mode,
      amount,
      UserStoreId: userId,
    };

    // Use the provided transaction object when creating the transaction record
    const transactionRecord = await sequelize.models.Transaction.create(
      transactionData,
      // { transaction }
    );

    return transactionRecord;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
