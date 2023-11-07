const app = require("../../server");

require("../api/user/routes/user")(app);
require("../api/product/routes/product")(app);
require("../api/variant/routes/variant")(app);
require("../api/upload/routes/upload")(app);
require("../api/role/routes/role")(app);
require("../api/permission/routes/permission")(app);
require("../api/store_info/routes/store_info")(app);
require("../api/plan/routes/plan")(app);
require("../api/subscription/routes/subscription")(app);
require("../api/global/routes/global")(app);
require("../api/global_brand/routes/global_brand")(app);
require("../api/category/routes/category")(app);
require("../api/payment_log/routes/payment_log")(app);
require("../api/banner/routes/banner")(app);
require("../api/lead/routes/lead")(app);
require("../api/privacy_policy/routes/privacy_policy")(app);
require("../api/about_us/routes/about_us")(app);
require("../api/term_condition/routes/term_condition")(app);
require("../api/tag/routes/tag")(app);
require("../api/admin/routes/admin")(app);
require("../api/support_ticket/routes/support_ticket")(app);
require("../api/contact_us/routes/contact_us")(app);
require("../api/cart/routes/cart")(app);
require("../api/store_setting/routes/store_setting")(app);
require("../api/default_page/routes/default_page")(app);
require("../api/fcm_configuration/routes/fcm_configuration")(app);
require("../api/free_plan/routes/free_plan")(app);
require("../api/campaign/routes/campaign")(app);
require("../api/tutorial/routes/tutorial")(app);
require("../api/activity_log/routes/activity_log")(app);
require("../api/bulk_pricing/routes/bulk_pricing")(app);
require("../api/collection/routes/collection")(app);
require("../api/address/routes/address")(app);
require("../api/collection_static/routes/collection_static")(app);
// require("../api/custom_courier/routes/custom_courier")(app);
