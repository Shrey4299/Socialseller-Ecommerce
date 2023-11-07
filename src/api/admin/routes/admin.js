const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const token_id_verify = require("../middlewares/jwt_id_verify");
const { dashboard, create } = require("../controllers/admin");
const { createAdminBody } = require("../middlewares/admin");

module.exports = (app) => {
  router.post("/admin/register", [createAdminBody], create);
  router.get("/admin/dashboard", dashboard);
  app.use("/api", router);
};
