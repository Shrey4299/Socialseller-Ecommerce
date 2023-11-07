// controllers/defaultPageController.js
/**
 * Controller function to create/update the default page content
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const getDefaultPage = await sequelize.models.Default_page.findOne();

    if (getDefaultPage) {
      const updateDefaultPage = await sequelize.models.Default_page.update(
        req.body,
        {
          where: { id: getDefaultPage.id },
          returning: true,
        }
      );

      return res
        .status(200)
        .send({
          message: "Default page updated",
          data: updateDefaultPage[1][0],
        });
    } else {
      const defaultPage = await sequelize.models.Default_page.create(req.body);
      return res
        .status(200)
        .send({
          message: "Default page Created Successfully",
          data: defaultPage,
        });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to update/create default page" });
  }
};

/**
 * Controller function to get the default page content
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.get = async (req, res) => {
  try {
    const sequelize = req.db;
    const defaultPage = await sequelize.models.Default_page.findOne();
    return res.status(200).send(defaultPage);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch default page" });
  }
};
