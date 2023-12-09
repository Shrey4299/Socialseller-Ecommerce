const jwt = require("../../../services/jwt");
const { tokenError, requestError } = require("../../../services/errors");
const dbCache = require("../../../utils/dbCache");

const createBody = (description, event, userId) => ({
  description,
  event,
  UserStoreId: userId,
});

exports.createActivityLog = async (
  req,
  res,
  client,
  event,
  description
  // t
) => {
  try {
    console.log("entered createActivityLog");
    console.log(client);
    const subdomain = client;
    const sequelize = dbCache.get(subdomain);
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
    const body = createBody(description, event, userId);

    const activity_log = await sequelize.models.Activity_log.create(body, {
      // transaction: t,
    });
  } catch (error) {
    console.error("Error in createActivityLog:", error);
    // return res.status(500).send({ error: "Failed to create an activity log" });
  }
};
