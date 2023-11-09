exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const customerCourier = await sequelize.models.Customer_courier.create(
      req.body
    );
    return res.status(200).send({
      message: "Customer Courier Created Successfully!",
      data: customerCourier,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create customer courier" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const customerCourierId = req.params.id;
    const [updatedRowsCount, updatedCustomerCourier] =
      await sequelize.models.Customer_courier.update(req.body, {
        where: { id: customerCourierId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Customer Courier not found" });
    }
    return res.status(200).send({
      message: "Customer Courier Updated Successfully!",
      data: updatedCustomerCourier[0],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to update the customer courier" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;

    console.log(sequelize);
    const customerCouriers = await sequelize.models.Customer_courier.findAll();
    return res.status(200).send(customerCouriers);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch customer couriers" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const customerCourierId = req.params.id;
    const customerCourier = await sequelize.models.Customer_courier.findOne({
      where: { id: customerCourierId },
      include: "subscription",
    });
    if (!customerCourier) {
      return res.status(404).send({ error: "Customer Courier not found" });
    }
    return res.status(200).send(customerCourier);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to fetch the customer courier" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const customerCourierId = req.params.id;
    const deletedRowCount = await sequelize.models.Customer_courier.destroy({
      where: { id: customerCourierId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Customer Courier not found" });
    }
    return res
      .status(200)
      .send({ message: "Customer Courier Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "Failed to delete the customer courier" });
  }
};
