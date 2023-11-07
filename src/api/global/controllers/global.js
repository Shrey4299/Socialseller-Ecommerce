// Controller function to create a new post
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const getglobal = await sequelize.models.Global.findAll();
    if (getglobal.length !== 0) {
      const updateGLobal = await sequelize.models.Global.update(req.body, {
        where: { id: getglobal[0].id },
        returning: true,
      });
      return res
        .status(400)
        .send({ message: "global updated", data: updateGLobal[1][0] });
    } else {
      const global = await sequelize.models.Global.create(req.body);
      return res
        .status(200)
        .send({ message: "Global Created Successfully", data: global });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a global" });
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

    const globals = await sequelize.models.Global.findOne();
    // console.log(sequelize.models.Global.rawAttributes["PAYMENT_GATEWAY"].values)
    return res.status(200).send(globals);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch globals" });
  }
};
