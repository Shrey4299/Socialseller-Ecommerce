require("dotenv").config();
const crypto = require("crypto");

module.exports = async function verify(ts, rawBody) {
  const body = ts + rawBody;
  const secretKey = process.env.CASHFREE_CLIENT_SECRET;
  let genSignature = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("base64");
  return genSignature;
};
