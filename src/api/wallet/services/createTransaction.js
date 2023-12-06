const jwt = require("../../../services/jwt");
const crypto = require("crypto");
const { tokenError, requestError } = require("../../../services/errors");

const generateTransactionId = () => {
  const randomBytes = crypto.randomBytes(5); // Generate 5 random bytes
  const transactionId = "WLT" + randomBytes.toString("hex").toUpperCase();
  return transactionId.substring(0, 13); // Take the first 10 characters
};

exports.createTransaction = async (
  req,
  res,
  purpose,
  txnType,
  remark,
  mode,
  amount
) => {
  try {
    const sequelize = req.db;
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

    const txnId = generateTransactionId();

    const transactionData = {
      purpose,
      txn_type: txnType,
      txn_id: txnId,
      remark,
      mode,
      amount,
      UserStoreId: userId,
    };

    const transaction = await sequelize.models.Transaction.create(
      transactionData
    );

    return transaction;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
