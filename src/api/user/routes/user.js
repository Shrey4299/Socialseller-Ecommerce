const router = require("express").Router();
const RBAC = require("../../../middlewares/RBAC");
const token_id_verify = require("../middlewares/jwt_id_verify");
const {
  create,
  find,
  findOne,
  update,
  delete: destroy,
  login,
  getMe,
  search,
  googleAuth,
  dashboard,
  supportTickets,
} = require("../controllers/user");
const {
  createAdminBody,
  createBody,
  updateBody,
  validateLoginBody,
} = require("../middlewares/user");

module.exports = (app) => {
  router.post("/users", [createBody], create);
  router.get("/users", find);
  router.get("/users/support-tickets", supportTickets);
  router.get("/users/me", getMe);
  router.get("/users/search", [RBAC], search);
  router.get("/users/dashboard", dashboard);
  router.get("/users/:id", [RBAC], findOne);
  router.put("/users/:id", [RBAC, token_id_verify, updateBody], update);
  router.delete("/users/:id", [RBAC], destroy);
  router.post("/users/login", [validateLoginBody], login);
  router.get("/users/auth/google", googleAuth);
  app.use("/api", router);
};
