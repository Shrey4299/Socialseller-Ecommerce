// controllers/fcmConfigurationController.js
/**
 * Controller function to create/update FCM configuration
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const getFCMConfig = await sequelize.models.FCM_configuration.findOne();

    if (getFCMConfig) {
      const updateFCMConfig = await sequelize.models.FCM_configuration.update(
        req.body,
        {
          where: { id: getFCMConfig.id },
          returning: true,
        }
      );

      return res
        .status(200)
        .send({
          message: "FCM configuration updated",
          data: updateFCMConfig[1][0],
        });
    } else {
      const fcmConfig = await sequelize.models.FCM_configuration.create(
        req.body
      );
      return res
        .status(200)
        .send({
          message: "FCM configuration Created Successfully",
          data: fcmConfig,
        });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to update/create FCM configuration" });
  }
};

/**
 * Controller function to get the FCM configuration
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.get = async (req, res) => {
  try {
    const sequelize = req.db;
    const fcmConfig = await sequelize.models.FCM_configuration.findOne();
    return res.status(200).send(fcmConfig);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch FCM configuration" });
  }
};
