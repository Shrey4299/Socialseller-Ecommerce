// Controller function to create a new Global_brand
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const getGlobalBrand = await sequelize.models.Global_brand.findAll();
    if (getGlobalBrand.length !== 0) {
      const updateGlobalBrand = await sequelize.models.Global_brand.update(
        req.body,
        {
          where: { id: getGlobalBrand[0].id },
          returning: true,
        }
      );
      return res.status(400).send({
        message: "Global brand updated",
        data: updateGlobalBrand[1][0],
      });
    } else {
      const globalBrand = await sequelize.models.Global_brand.create(req.body);
      return res.status(200).send({
        message: "Global brand Created Successfully",
        data: globalBrand,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a global brand" });
  }
};

// Controller function to get the global brand
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;

    const globalBrand = await sequelize.models.Global_brand.findOne();
    return res.status(200).send(globalBrand);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch global brand" });
  }
};
