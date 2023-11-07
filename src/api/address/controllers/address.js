exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const address = await sequelize.models.Address.create(req.body);
    return res
      .status(200)
      .send({ message: "Address Created Successfully!", data: address });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create address" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const addressId = req.params.id;
    const [updatedRowsCount, updatedAddress] =
      await sequelize.models.Address.update(req.body, {
        where: { id: addressId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Address not found" });
    }
    return res
      .status(200)
      .send({
        message: "Address Updated Successfully!",
        data: updatedAddress[0],
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the address" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;
    const addresses = await sequelize.models.Address.findAll();
    return res.status(200).send(addresses);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch addresses" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const addressId = req.params.id;
    const address = await sequelize.models.Address.findOne({
      where: { id: addressId },
    });
    if (!address) {
      return res.status(404).send({ error: "Address not found" });
    }
    return res.status(200).send(address);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the address" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const addressId = req.params.id;
    const deletedRowCount = await sequelize.models.Address.destroy({
      where: { id: addressId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Address not found" });
    }
    return res.status(200).send({ message: "Address Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the address" });
  }
};
