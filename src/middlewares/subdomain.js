const app = require("../../server");

module.exports = (req, res, next) => {
  console.log(req.hostname + " this is hostname");

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
    "user_store",
    "address",
    "orders",
    "payment_log",
    "public",
    "order_variant",
    "custom_courier",
    "wallets",
    "roles",
    "permissions",
  ];
  if (
    parts.length > 1 &&
    !req.url.includes("webhook") &&
    !req.hostname.includes("ngrok")
  ) {
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
    let api = req.url.split("?")[0].split("/")[2];
    let mainRoutes = [
      "users",
      "uploads",
      "user_metrics",
      "permissions",
      "roles",
      "admin",
      "subscriptions",
      "plans",
      "plan_metrics",
      "globals",
      "payment_log",
      "support-tickets",
      "cart",
      "global_brands",
      "store_setting",
      "fcm_configuration",
      "free_plan",
      "activity_log",
      "wallets",
      "transactions",
      "order",
      "subscriptions",
      "public",
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
