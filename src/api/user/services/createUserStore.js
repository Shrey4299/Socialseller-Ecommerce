const dbCache = require("../../../utils/dbCache");

exports.createUserStore = async (req, res, subdomain) => {
  try {
    console.log("entering createUserStore");
    console.log(subdomain);
    const sequelize = dbCache.get(subdomain);
    body = {
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    const User_store = await sequelize.models.User_store.create(body);

    console.log("user created successfully");
  } catch (error) {
    console.error(error);
    // return res.status(500).send({ error: "Failed to create a user store" });
  }
};
