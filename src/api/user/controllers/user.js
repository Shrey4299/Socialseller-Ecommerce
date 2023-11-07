const dbCache = require("../../../utils/dbCache");
const { Sequelize, where } = require("sequelize");
const createDB = require("../services/createDB");
const relation = require("../../../utils/relation");
const jwt = require("../../../services/jwt");
const { hash, compare } = require("../../../services/bcrypt");
const { Op } = require("sequelize");
const { tokenError, requestError } = require("../../../services/errors");
const { getPagination, getMeta } = require("../../../services/pagination");
const orderBy = require("../../../services/orderBy");
const { OAuth2Client } = require("google-auth-library");
const dbConnection = require("../../../utils/dbConnection");
const { getDate } = require("../../subscription/services/subscription");
// const pgp = require('pg-promise')()
const GOOGLE_CLIENT_ID =
  "855848332125-ha16ukjhnji5b2rtlpergsl66koc75j6.apps.googleusercontent.com";
const client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: "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",
  redirectUri: "http://localhost:4500/api/users/auth/google",
});

module.exports = {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async create(req, res) {
    try {
      const sequelize = req.db;
      const { username, email, password, subdomain } = req.body;

      const dbConn = new Sequelize("postgres", "postgres", "Sonu619@", {
        host: "localhost",
        dialect: "postgres",
      });

      const findUser = await sequelize.models.User.findOne({
        where: [{ username }, { email }, { subdomain }, { database: username }],
      });

      if (findUser)
        return res.status(409).send(
          requestError({
            staus: 409,
            name: "Conflicts",
            message: "Credentials Already Exists",
            details: "Entered Credentials are already exists!",
          })
        );
      // encrypting password
      const hashedPassword = await hash(password);
      // creating user
      const createUser = await sequelize.models.User.create({
        username: username,
        email: email,
        password: hashedPassword,
        port: 5432,
        database: username,
        host: "localhost",
        db_username: "postgres",
        subdomain: subdomain,
      });

      // creating user db
      var resultDB = await createDB({ connection: dbConn, username, password });
      if (!resultDB) {
        return res.status(500).send({
          error: {
            status: 500,
            name: "Server Error",
            message: "DB not created",
            details: "",
          },
        });
      }
      // creating sequelize instance on the basis of user details
      const tenantConfig = {
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Sonu619@",
        database: createUser.username,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      };
      // db to store instance
      const db = {};
      if (resultDB) {
        const instance_sequelize = new Sequelize(tenantConfig);
        db.instance_sequelize = await relation(instance_sequelize);
        dbCache.set(subdomain, db.instance_sequelize);
        await db.instance_sequelize.sync();
        return res.status(200).send({
          message: {
            status: 201,
            name: "User Created!",
            message: "",
            details: "",
          },
        });
      } else {
        return res.status(500).send({
          error: {
            status: 500,
            name: "Internal Server Error!",
            message: "Some error occurred!",
            details: "",
          },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */

  async find(req, res) {
    try {
      const sequelize = req.db;
      const query = req.query;
      const pagination = await getPagination(query.pagination);
      const order = orderBy(query);
      const users = await sequelize.models.User.findAndCountAll({
        offset: pagination.offset,
        limit: pagination.limit,
        order: order,
      });
      const meta = await getMeta(pagination, users.count);
      return res.status(200).send({ data: users.rows, meta });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */

  async findOne(req, res) {
    try {
      const sequelize = req.db;
      const { id } = req.params;
      const user = await sequelize.models.User.findByPk(id);
      if (user) {
        return res.status(200).send(user);
      } else {
        return res
          .status(400)
          .send(requestError({ message: "Invalid User ID" }));
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */

  async update(req, res) {
    try {
      const sequelize = req.db;
      const { id } = req.params;
      const getUser = await sequelize.models.User.findByPk(id);
      if (!getUser)
        return res
          .status(400)
          .send(requestError({ message: "Invalid User ID" }));
      const user = await sequelize.models.User.update(req.body, {
        where: { id },
      });
      return res.status(200).send({ message: "User Updated Successfull!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  async delete(req, res) {
    try {
      const sequelize = req.db;
      const { id } = req.params;
      const getUser = await sequelize.models.User.findByPk(id);
      if (!getUser)
        return res
          .status(400)
          .send(requestError({ message: "Invalid User ID" }));
      const user = await sequelize.models.User.destroy({ where: { id } });
      return res.status(200).send({ message: "User Delete Successully!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const sequelize = req.db;
      const findUser = await sequelize.models.User.findOne({
        where: { email },
      });
      if (!findUser) {
        return res
          .status(400)
          .send(requestError({ message: "Invalid User Credentials!" }));
      }
      const isMatched = await compare(password, findUser.password);
      if (!isMatched) {
        return res
          .status(400)
          .send(requestError({ message: "Invalid User Credentials!" }));
      }
      const token = await jwt.issue({ id: findUser.id });
      delete findUser.password;
      return res.status(200).send({ jwt: token, user: findUser });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async googleAuth(req, res) {
    try {
      // console.log({ verified: verifyGoogleToken(req.body.credential) });
      console.log("inside signp");
      console.log(req.query);
      const query = req.query;

      const { tokens } = await client.getToken(query.code);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID,
      });

      const sequelize = dbCache.get("main_instance");
      const payload = ticket.getPayload();

      if (payload.email_verified) {
        const isUserExists = await sequelize.models.User.findOne({
          where: { email: payload.email },
        });
        console.log(isUserExists);
        if (isUserExists) {
          const token = jwt.issue({ id: isUserExists.id });
          return res
            .status(200)
            .redirect(`http://localhost:3000/welcome?jwt=${token}`);
        } else {
          dbCache.set(payload.email, payload, "300");
          return res
            .status(200)
            .redirect(`http://localhost:3000/signup?key=${payload.email}`);
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  async getMe(req, res) {
    try {
      const sequelize = req.db;
      const token = jwt.verify(req);
      if (token.error) {
        return res.status(401).send(tokenError(token));
      }
      const findUser = await sequelize.models.User.findByPk(token.id, {
        include: [
          {
            model: sequelize.models.Subscription,
            as: "subscriptions",
            where: {
              [Op.and]: [
                { status: "ACTIVE" },
                {
                  valid_to: {
                    [Op.lt]: getDate(),
                  },
                },
              ],
            },
          },
          {
            model: sequelize.models.Subscription,
            as: "subscriptions",
            required: false,
          },
        ],
      });

      // for development only without rbac
      if (!findUser) {
        return res.status(400).send(
          requestError({
            message: "Invalid Data!",
            details: "Invalid payload data found in token!",
          })
        );
      }

      if (findUser.subscriptions.length > 0) {
        for (const subscription of findUser.subscriptions) {
          await sequelize.models.Subscription.update(
            { status: "EXPIRED" },
            { where: { id: subscription.id } }
          );
        }
      }

      return res.status(200).send(findUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  async supportTickets(req, res) {
    try {
      const sequelize = req.db;
      const token = jwt.verify(req);
      if (token.error) {
        return res.status(401).send(tokenError(token));
      }
      console.log(token);
      const query = await req.query;
      const pagination = await getPagination(query.pagination);
      const support_tickets =
        await sequelize.models.Support_ticket.findAndCountAll({
          offset: pagination.offset,
          limit: pagination.limit,
          include: [
            {
              model: sequelize.models.User,
              as: "user",
              where: { id: token.id },
            },
          ],
        });
      const meta = await getMeta(pagination, support_tickets.count);

      return res.status(200).send({ data: support_tickets.rows, meta });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  async search(req, res) {
    try {
      const sequelize = req.db;
      const query = req.query;
      const qs = query.qs;
      const pagination = await getPagination(query.pagination);
      const order = orderBy(query);
      const users = await sequelize.models.User.findAndCountAll({
        offset: pagination.offset,
        limit: pagination.limit,
        order: order,
        where: {
          [Op.or]: [
            {
              username: { [Op.iLike]: `%${qs}%` },
            },
            {
              email: { [Op.iLike]: `%${qs}%` },
            },
            {
              subdomain: { [Op.iLike]: `%${qs}%` },
            },
          ],
        },
      });
      const meta = await getMeta(pagination, users.count);
      return res.status(200).send({ data: users.rows, meta });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  async dashboard(req, res) {
    try {
      const token = jwt.verify(req);
      const mainDB = req.db;
      const user = await mainDB.models.User.findByPk(token.id);
      if (!user.subdomain) {
        return res.status(
          requestError({
            message: "You do not have any registered subdomain",
            status: 404,
          })
        );
      }
      const sequelize = await dbConnection(user.subdomain);
      const [products, leads, tags] = await Promise.all([
        sequelize.models.Product.count(),
        sequelize.models.Lead.count(),
        sequelize.models.Tag.count(),
      ]);

      res.status(200).send({ products, leads, tags });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
