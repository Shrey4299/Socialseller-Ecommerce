const jwt = require("../services/jwt");
const dbCache = require("../utils/dbCache");
const { requestError } = require("../services/errors");

module.exports = async (req, res, next) => {
  try {
    const sequelize = await dbCache.get("main_instance");
    let endpoint = req.api;
    let params = req.params;
    endpoint = Object.entries(params).reduce(
      (str, [key, value]) => str.replace(new RegExp(value, "g"), `:${key}`),
      endpoint
    );

    const Permission = await sequelize.models.Permission.findOne({
      where: [{ endpoint }, { method: req.method }],
    });

    if (!Permission) {
      return res.status(403).send(
        requestError({
          status: 403,
          name: "ForbiddenError",
          message: "Forbidden",
          details: "You don't have permission to access this route",
        })
      );
    }

    const Role_permissions = await sequelize.models.Role_permission.findAll({
      where: { PermissionId: Permission.id },
    });

    if (!Role_permissions || Role_permissions.length === 0) {
      return res.status(403).send(
        requestError({
          status: 403,
          name: "ForbiddenError",
          message: "Forbidden",
          details: "You don't have permission to access this route",
        })
      );
    }

    const parts = req.hostname.split(".");
    let subdomain = parts[0];
    let user, role;

    if (req.headers.authorization) {
      const token = jwt.verify(req);
      if (token.error) return res.status(400).send({ error: token.error });
      user = await sequelize.models.User.findOne({
        where: { id: token.id },
        include: [{ model: sequelize.models.Role, as: "role" }],
      });

      if (!user) {
        return res.status(403).send(
          requestError({
            status: 403,
            name: "ForbiddenError",
            message: "Forbidden",
            details: "You don't have permission to access this route",
          })
        );
      }
      role = user.role;
    } else {
      // const getrole = await sequelize.models.Role.findOne({
      //   where: { name: "public" },
      // });
      // role = getrole;

      return res.status(403).send(
        requestError({
          status: 403,
          name: "ForbiddenError",
          message: "Forbidden",
          details: "You don't have permission to access this route",
        })
      );
    }

    console.log(role);

    for (const Role_permission of Role_permissions) {
      if (
        Role_permission.RoleId === role.id &&
        Role_permission.PermissionId === Permission.id
      ) {
        console.log("Role is matched");
        return next();
      }
    }

    return res.status(403).send(
      requestError({
        status: 403,
        name: "ForbiddenError",
        message: "Forbidden",
        details: "You don't have permission to access this route",
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
