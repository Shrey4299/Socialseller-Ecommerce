const createActivityLog = require("../../../services/createActivityLog");

exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const tutorial = await sequelize.models.Tutorial.create(req.body);
    const tutorialActivityLog = await createActivityLog.createActivityLog(
      req,
      res,
      "NEW_TUTORIAL_ADDED",
      "New tutoria created successfully!"
    );
    return res
      .status(200)
      .send({ message: "Tutorial Created Successfully!", data: tutorial });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a tutorial" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const tutorialId = req.params.id;
    const [updatedRowsCount, updatedTutorial] =
      await sequelize.models.Tutorial.update(req.body, {
        where: { id: tutorialId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Tutorial not found" });
    }
    return res.status(200).send({
      message: "Tutorial Updated Successfully!",
      data: updatedTutorial[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the tutorial" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;
    const tutorials = await sequelize.models.Tutorial.findAll();
    return res.status(200).send(tutorials);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch tutorials" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const tutorialId = req.params.id;
    const tutorial = await sequelize.models.Tutorial.findOne({
      where: { id: tutorialId },
    });
    if (!tutorial) {
      return res.status(404).send({ error: "Tutorial not found" });
    }
    return res.status(200).send(tutorial);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the tutorial" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const tutorialId = req.params.id;
    const deletedRowCount = await sequelize.models.Tutorial.destroy({
      where: { id: tutorialId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Tutorial not found" });
    }
    return res.status(200).send({ message: "Tutorial Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the tutorial" });
  }
};
