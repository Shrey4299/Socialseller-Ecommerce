// Controller function to create a new post
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const getEntries = await sequelize.models.About_us.findAll();
    if (getEntries.length !== 0) {
      const updateAbout = await sequelize.models.About_us.update(req.body, {
        where: { id: getEntries[0].id },
        returning: true,
      });
      return res
        .status(200)
        .send({ message: "About Us Updated!", data: updateAbout[1][0] });
    }
    const about_us = await sequelize.models.About_us.create(req.body);
    return res
      .status(200)
      .send({ message: "About Us Created", data: about_us });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a about_us" });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
// Controller function to get all posts
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const about_us = await sequelize.models.About_us.findOne();
    return res.status(200).send(about_us);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch about_uss" });
  }
};
