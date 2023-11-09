const role = require("../api/role/models/role");
const permission = require("../api/permission/models/permission");
const user = require("../api/user/models/user");
const role_permission = require("../api/permission/models/role_permission");
const plan = require("../api/plan/models/plan");
const subscription = require("../api/subscription/models/subscription");
const global = require("../api/global/models/global");
const payment_log = require("../api/payment_log/models/payment_log");
const support_ticket = require("../api/support_ticket/models/support_ticket");
const contact_us = require("../api/contact_us/models/contact_us");
const cart = require("../api/cart/models/cart");
const global_brand = require("../api/global_brand/models/global_brand");
const store_setting = require("../api/store_setting/models/store_setting");
const default_page = require("../api/default_page/models/default_page");
const fcm_configuration = require("../api/fcm_configuration/models/fcm_configuration");
const free_plan = require("../api/free_plan/models/free_plan");
const custom_courier = require("../api/custom_courier/models/custom_courier");
const address = require("../api/address/models/address");
const group = require("../api/group/models/group");
const plan_metrics = require("../api/plan_metrics/models/plan_metrics"); // Added Plan_metrics
const user_metrics = require("../api/user_metrics/models/user_metrics"); // Added Plan_metrics
const activity_log = require("../api/activity_log/models/activity_log");
const wallet = require("../api/wallet/models/wallet");
const transaction = require("../api/transaction/models/transaction");

module.exports = async (sequelize) => {
  const db = {};
  db.sequelize = sequelize;
  db.Role = role(sequelize);
  db.Permission = permission(sequelize);
  db.User = user(sequelize);
  db.Role_permission = role_permission(sequelize);
  db.Plan = plan(sequelize);
  db.Subscription = subscription(sequelize);
  db.Global = global(sequelize);
  db.Payment_log = payment_log(sequelize);
  db.Contact_us = contact_us(sequelize);
  db.Cart = cart(sequelize);
  db.Support_ticket = support_ticket(sequelize);
  db.Global_brand = global_brand(sequelize);
  db.Store_setting = store_setting(sequelize);
  db.Default_page = default_page(sequelize);
  db.FCM_configuration = fcm_configuration(sequelize);
  db.Free_plan = free_plan(sequelize);
  db.Activity_log = activity_log(sequelize);
  db.Custom_courier = custom_courier(sequelize);
  db.Address = address(sequelize);
  db.Group = group(sequelize);
  db.Plan_metrics = plan_metrics(sequelize);
  db.User_metrics = user_metrics(sequelize);
  db.Wallet = wallet(sequelize);
  db.Transaction = transaction(sequelize);

  // User -> Role
  db.Role.hasMany(db.User, { foreignKey: "RoleId", as: "users" });
  db.User.belongsTo(db.Role, { foreignKey: "RoleId", as: "role" });
  // Support Ticket -> User
  db.Support_ticket.belongsTo(db.User, { foreignKey: "UserId", as: "user" });
  // Role -> Permission
  db.Role.belongsToMany(db.Permission, {
    as: "permissions",
    through: db.Role_permission,
  });
  db.Permission.belongsToMany(db.Role, {
    as: "roles",
    through: db.Role_permission,
  });
  // User -> Subscription
  db.User.hasMany(db.Subscription, {
    foreignKey: "UserId",
    as: "subscriptions",
  });
  db.Subscription.belongsTo(db.User, { foreignKey: "UserId", as: "user" });
  // Plan -> Subscription
  db.Plan.hasMany(db.Subscription, {
    foreignKey: "PlanId",
    as: "subscriptions",
  });
  db.Subscription.belongsTo(db.Plan, { foreignKey: "PlanId", as: "plan" });

  // User -> Activity_log
  db.User.hasMany(db.Activity_log, {
    foreignKey: "UserId",
    as: "activity_logs",
  });
  db.Activity_log.belongsTo(db.User, { foreignKey: "UserId", as: "user" });

  db.Custom_courier.belongsTo(db.Subscription, {
    foreignKey: "SubscriptionId",
    as: "subscription",
  });

  db.User.hasMany(db.Address, {
    foreignKey: "UserId",
    as: "addresses",
  });
  db.Address.belongsTo(db.User, { foreignKey: "UserId", as: "user" });

  db.Plan_metrics.belongsTo(db.Plan, { foreignKey: "PlanId", as: "plan" });
  db.Plan.hasOne(db.Plan_metrics, { foreignKey: "PlanId", as: "plan_metrics" });

  db.User_metrics.belongsTo(db.User, {
    foreignKey: "UserId",
    as: "user",
  });

  db.User.hasOne(db.User_metrics, {
    foreignKey: "UserId",
    as: "user_metrics",
  });

  db.User.hasMany(db.Wallet, {
    foreignKey: "UserId",
    as: "wallets",
  });

  db.Wallet.belongsTo(db.Subscription, {
    foreignKey: "SubscriptionId",
    as: "subscription",
  });

  db.User.hasMany(db.Transaction, {
    foreignKey: "UserId",
    as: "transaction",
  });
  db.Transaction.belongsTo(db.User, {
    foreignKey: "UserId",
    as: "user",
  });

  return db.sequelize;
};
