const { sendOrderConfirmationEmail } = require("../../../services/emailSender");
const fs = require("fs");
const ejs = require("ejs");
const firebaseAdmin = require("firebase-admin");
const { getPagination, getMeta } = require("../../../services/pagination");
const orderBy = require("../../../services/orderBy");
const { Op } = require("sequelize");
const jwt = require("../../../services/jwt");
const { hash, compare } = require("../../../services/bcrypt");
const { tokenError, requestError } = require("../../../services/errors");
const bcrypt = require("bcrypt");

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
    console.log("entered in findOne");
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

exports.search = async (req, res) => {
  try {
    console.log("entered search");
    const sequelize = req.db;
    const query = req.query;
    const qs = query.qs;
    const pagination = await getPagination(query.pagination);
    const order = orderBy(query);
    const users = await sequelize.models.User_store.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,
      where: {
        [Op.or]: [
          {
            name: { [Op.iLike]: `%${qs}%` },
          },
          {
            email: { [Op.iLike]: `%${qs}%` },
          },
        ],
      },
      include: "addresses",
    });
    const meta = await getMeta(pagination, users.count);
    return res.status(200).send({ data: users.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sequelize = req.db;
    const findUser = await sequelize.models.User_store.findOne({
      where: { email: email },
    });

    if (!findUser) {
      return res.status(400).send({ message: "Invalid User Credentials!" });
    }

    // const isMatched = await bcrypt.compare(password, findUser.password);
    const isMatched = await compare(password, findUser.password);

    if (!isMatched) {
      return res
        .status(400)
        .send({ message: "User Credentials dosent match!" });
    }

    const token = await jwt.issue({ id: findUser.id });
    return res.status(200).send({ jwt: token, user: findUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.getMe = async (req, res) => {
  try {
    const sequelize = req.db;
    const token = jwt.verify(req);
    if (token.error) {
      return res.status(401).send(tokenError(token));
    }
    const findUser = await sequelize.models.User_store.findByPk(token.id);

    if (!findUser) {
      return res.status(400).send(
        requestError({
          message: "Invalid Data!",
          details: "Invalid payload data found in token!",
        })
      );
    }

    return res.status(200).send(findUser);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
