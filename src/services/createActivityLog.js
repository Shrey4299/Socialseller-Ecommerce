const jwt = require("../services/jwt");
const { tokenError, requestError } = require("../services/errors");

const createBody = (description, event, userId) => ({
  description,
  event,
  UserStoreId: userId,
});

exports.createActivityLog = async (req, res, event, description) => {
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

    const body = createBody(description, event, userId);
    const activity_log = await sequelize.models.Activity_log.create(body);
  } catch (error) {
    console.error(error);
    // return res.status(500).send({ error: "Failed to create an activity log" });
  }
};
