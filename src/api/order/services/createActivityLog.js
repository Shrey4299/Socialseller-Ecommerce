require("dotenv").config();

const USER_ROLE = process.env.USER_ROLE || 3;
const STAFF_ROLE = process.env.STAFF_ROLE || 4;
const ADMIN_ROLE = process.env.ADMIN_ROLE || 5;

const createBody = (description, event, userId) => ({
  description,
  event,
  UserStoreId: userId,
});

exports.createActivityLog = async (sequelize, userId, RoleId, res) => {
  try {
    const body1 = createBody("User logged in", "USER_LOG_IN", userId);
    const body2 = createBody("Staff logged in", "STAFF_LOG_IN", userId);
    const body3 = createBody("Admin logged in", "ADMIN_LOG_IN", userId);

    console.log(RoleId);

    let activity_log;

    switch (RoleId) {
      case parseInt(ADMIN_ROLE):
        activity_log = await sequelize.models.Activity_log.create(body3);
        break;

      case parseInt(STAFF_ROLE):
        activity_log = await sequelize.models.Activity_log.create(body2);
        break;

      default:
        activity_log = await sequelize.models.Activity_log.create(body1);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create an activity log" });
  }
};
