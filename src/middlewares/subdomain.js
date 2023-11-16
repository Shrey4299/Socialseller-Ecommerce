const app = require("../../server");

// middlewares/subdomain.js
module.exports = (req, res, next) => {
  const parts = req.hostname.split(".");
  let sharedRoutes = [
    "products",
    "variants",
    "store-info",
    "uploads",
    "categories",
    "search",
    "banner",
    "leads",
    "privacy-policy",
    "about-us",
    "terms",
    "tags",
    "cart",
    "contact-us",
    "campaign",
    "tutorial",
    "bulk_pricing",
    "collection",
    "collection_static",
    "product_metrics",
    "sub_categories",
    "default_pages",
    "store_setting",
    "groups",
  ];
  if (parts.length > 1) {
    // shared routes
    console.log("greater");
    let api = req.url.split("?")[0].split("/")[2];
    if (!sharedRoutes.includes(api)) {
      return res.status(404).send({
        error: {
          status: 404,
          name: "Not found!",
          messge:
            "The page your'e looking for does not exists in seller domain",
        },
      });
    } else {
      req.subdomain = parts[0];
      next();
    }
  } else {
    // main routes
    let api = req.url.split("?")[0].split("/")[2];
    let mainRoutes = [
      "users",
      "user_metrics",
      "permissions",
      "roles",
      "admin",
      "subscriptions",
      "custom_courier",
      "plans",
      "plan_metrics",
      "globals",
      "payment-logs",
      "support-tickets",
      "cart",
      "global_brands",
      "store_setting",
      "fcm_configuration",
      "free_plan",
      "activity_log",
      "address",
      "wallets",
      "transactions",
    ];

    if (!mainRoutes.includes(api))
      return res.status(404).send({
        error: {
          status: 404,
          name: "Not found!",
          messge:
            "The page your'e looking for does not  exists in admin domain !",
        },
      });
    req.subdomain = null;
    next();
  }
};
