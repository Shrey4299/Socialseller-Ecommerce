const { sendOrderConfirmationEmail } = require("../../../services/emailSender");
const fs = require("fs");
const ejs = require("ejs");
const firebaseAdmin = require("firebase-admin");

exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const User_store = await sequelize.models.User_store.create(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const task = "created";

    const htmlContent = fs.readFileSync("./views/accountCreated.ejs", "utf8");
    const renderedContent = ejs.render(htmlContent, {
      name,
      task,
    });

    const token =
      "fJTTL0EVXZo6_tdNsUytRY:APA91bH5LstGlPSY_LQPfP8hFCDpIUmYF8o4Ct5qR1vgctcxYxTRfVscCRsjmscoOdSEuO8skY3MgKrQ7k5VBeRe-vgmvC9oXnPlP7Pc65UQTyoI0F5Vvd-vo5fa99lIDIFVNUd5WHI6";

    const message = {
      notification: {
        title: "user Created  successfullY!",
        body: "now you can enjoy shopping",
      },
      token,
    };

    try {
      const sendMessage = await firebaseAdmin.messaging().send(message);
      console.log("Notification sent successfully:", sendMessage);
    } catch (error) {
      console.error("Error sending notification:", error);
    }

    await sendOrderConfirmationEmail(email, renderedContent);

    return res
      .status(200)
      .send({ message: "User Store Created Successfully!", data: User_store });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a user store" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const userStoreId = req.params.id;
    const [updatedRowsCount, updatedUserStore] =
      await sequelize.models.User_store.update(req.body, {
        where: { id: userStoreId },
        returning: true,
      });
    if (updatedRowsCount === 0) {
      return res.status(404).send({ error: "User Store not found" });
    }
    return res.status(200).send({
      message: "User Store Updated Successfully!",
      data: updatedUserStore[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to update the user store" });
  }
};

exports.findAll = async (req, res) => {
  try {
    console.log(req);
    const sequelize = req.db;
    const userStores = await sequelize.models.User_store.findAll();

    return res.status(200).send(userStores);
  } catch (error) {
    return res.status(500).send({ error: "Failed to fetch user stores" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const userStoreId = req.params.id;
    const userStore = await sequelize.models.User_store.findOne({
      where: { id: userStoreId },
    });
    if (!userStore) {
      return res.status(404).send({ error: "User Store not found" });
    }

    return res.status(200).send(userStore);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch the user store" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const userStoreId = req.params.id;
    const deletedRowCount = await sequelize.models.User_store.destroy({
      where: { id: userStoreId },
    });
    if (deletedRowCount === 0) {
      return res.status(404).send({ error: "User Store not found" });
    }
    return res
      .status(200)
      .send({ message: "User Store Deleted Successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to delete the user store" });
  }
};
