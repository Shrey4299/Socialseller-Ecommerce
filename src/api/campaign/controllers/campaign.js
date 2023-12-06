const createActivityLog = require("../../../services/createActivityLog");

/**
 * Controller function to create a new campaign
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const campaign = await sequelize.models.Campaign.create(req.body);

    const campaignActivityLog = await createActivityLog.createActivityLog(
      req,
      res,
      "NEW_CAMPAIGN_ADDED",
      "New campaign created successfully!"
    );

    return res
      .status(200)
      .send({ message: "Campaign Created Successfully!", data: campaign });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a campaign" });
  }
};

/**
 * Controller function to update an existing campaign
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const campaignId = req.params.id;
    const [updatedRowsCount, updatedCampaign] =
      await sequelize.models.Campaign.update(req.body, {
        where: { id: campaignId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "Campaign not found" });
    }
    return res.status(200).send({
      message: "Campaign Updated Successfully!",
      data: updatedCampaign[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the campaign" });
  }
};

/**
 * Controller function to find all campaigns
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.findAll = async (req, res) => {
  try {
    const sequelize = req.db;
    const campaigns = await sequelize.models.Campaign.findAll();
    return res.status(200).send(campaigns);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch campaigns" });
  }
};

/**
 * Controller function to find a single campaign by its ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const campaignId = req.params.id;
    const campaign = await sequelize.models.Campaign.findOne({
      where: { id: campaignId },
    });
    if (!campaign) {
      return res.status(404).send({ error: "Campaign not found" });
    }
    return res.status(200).send(campaign);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the campaign" });
  }
};

/**
 * Controller function to delete a campaign by its ID
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const campaignId = req.params.id;
    const deletedRowCount = await sequelize.models.Campaign.destroy({
      where: { id: campaignId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "Campaign not found" });
    }
    return res.status(200).send({ message: "Campaign Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the campaign" });
  }
};
