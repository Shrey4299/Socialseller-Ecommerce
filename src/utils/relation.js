const dbCache = require("./dbCache");
const product = require("../api/product/models/product");
const variant = require("../api/variant/models/variant");
const media = require("../api/upload/models/media");

const store_info = require("../api/store_info/models/store_info");
const category = require("../api/category/models/category");
const tag = require("../api/tag/models/tag");
const productTag = require("../api/tag/models/productTag");
const banner = require("../api/banner/models/banner");
const about_us = require("../api/about_us/models/about_us");
const lead = require("../api/lead/models/lead");
const privacy_policy = require("../api/privacy_policy/models/privacy_policy");
const term_condition = require("../api/term_condition/models/term_condition");
const cart = require("../api/cart/models/cart");
const cart_variant = require("../api/cart/models/cartVariant");
const campaign = require("../api/campaign/models/campaign");
const tutorial = require("../api/tutorial/models/tutorial");
const bulkPricing = require("../api/bulk_pricing/models/bulk_pricing");
const collection = require("../api/collection/models/collection");
const collection_static = require("../api/collection_static/models/collection_static");
const product_metrics = require("../api/product_metrics/models/product_metrics");
const sub_category = require("../api/sub_category/models/sub_category");
const contact_us = require("../api/contact_us/models/contact_us");
const default_page = require("../api/default_page/models/default_page");
const store_setting = require("../api/store_setting/models/store_setting");
const group = require("../api/group/models/group");
const user_store = require("../api/user_store/models/user_store");
const address = require("../api/address/models/address");
const order = require("../api/order/models/order");
const order_variant = require("../api/order/models/order_variant");
const payment_log = require("../api/payment_log/models/payment_log");

module.exports = async (sequelize) => {
  const db = {};
  db.sequelize = sequelize;

  db.Product = product(sequelize);
  db.Variant = variant(sequelize);
  db.Media = media(sequelize);
  db.Store = store_info(sequelize);
  db.Category = category(sequelize);
  db.Tag = tag(sequelize);
  db.ProductTag = productTag(sequelize);
  db.Banner = banner(sequelize);
  db.About_us = about_us(sequelize);
  db.Lead = lead(sequelize);
  db.Privacy_policy = privacy_policy(sequelize);
  db.Term_condition = term_condition(sequelize);
  db.Cart = cart(sequelize);
  db.Contact_us = contact_us(sequelize);
  db.CartVariant = cart_variant(sequelize);
  db.Campaign = campaign(sequelize);
  db.Tutorial = tutorial(sequelize);
  db.Bulk_pricing = bulkPricing(sequelize);
  db.Collection = collection(sequelize);
  db.Collection_static = collection_static(sequelize);
  db.Product_metrics = product_metrics(sequelize);
  db.Sub_category = sub_category(sequelize);
  db.Default_page = default_page(sequelize);
  db.Store_setting = store_setting(sequelize);
  db.Group = group(sequelize);
  db.User_store = user_store(sequelize);
  db.Address = address(sequelize);
  db.Order = order(sequelize);
  db.Order_variant = order_variant(sequelize);
  db.Payment_log = payment_log(sequelize);

  // ++++++ RELATIONS ++++++
  db.Category.hasMany(db.Product, { foreignKey: "CategoryId", as: "products" });
  db.Product.belongsTo(db.Category, {
    foreignKey: "CategoryId",
    as: "category",
  });
  db.Category.belongsTo(db.Media, {
    foreignKey: "ThumbnailId",
    as: "thumbnail",
  });
  db.Product.belongsTo(db.Media, {
    foreignKey: "ThumbnailId",
    as: "thumbnail",
  });
  // +++++++++ Relation with Media ++++++++++
  db.Variant.belongsTo(db.Media, {
    foreignKey: "ThumbnailId",
    as: "thumbnail",
  });

  db.Cart.belongsToMany(db.Variant, { through: "CartVariant" });
  db.Variant.belongsToMany(db.Cart, { through: "CartVariant" });
  db.CartVariant.belongsTo(db.Cart);
  db.CartVariant.belongsTo(db.Variant);

  db.Store.belongsTo(db.Media, { foreignKey: "LogoId", as: "logo" });
  db.Store.belongsTo(db.Media, { foreignKey: "BannerId", as: "banner" });
  db.Banner.belongsTo(db.Media, { foreignKey: "ThumbnailId", as: "thumbnail" });
  // PRODUCT AND PRODUCT VARIANTS
  db.Product.hasMany(db.Variant, { foreignKey: "ProductId", as: "variants" });
  db.Variant.belongsTo(db.Product, { foreignKey: "ProductId", as: "product" });

  db.Tag.belongsToMany(db.Product, { as: "products", through: db.ProductTag });
  db.Product.belongsToMany(db.Tag, { as: "tags", through: db.ProductTag });

  db.Bulk_pricing.belongsTo(db.Variant, {
    foreignKey: "VariantId",
    as: "variants",
  });

  db.Collection.hasMany(db.Product, {
    foreignKey: "CollectionId",
    as: "products",
  });
  db.Product.belongsTo(db.Collection, {
    foreignKey: "CollectionId",
    as: "collection",
  });

  db.Collection_static.hasMany(db.Product, {
    foreignKey: "CollectionStaticId",
    as: "products",
  });

  db.Product.belongsTo(db.Collection_static, {
    foreignKey: "CollectionStaticId",
    as: "collection_static",
  });

  db.Lead.hasOne(db.Product, {
    foreignKey: "LeadId", // This is the foreign key that will be dded to the Product model
    as: "product", // Alias to access the associated produc
  });

  db.Product.belongsTo(db.Lead, {
    foreignKey: "LeadId", // This should match the foreign key defned in db.Lead.hasOne
    as: "lead", // Alias to access the associated lead
  });

  db.Product_metrics.belongsTo(db.Product, {
    foreignKey: "ProductId",
    as: "product",
  });

  db.Product.hasOne(db.Product_metrics, {
    foreignKey: "ProductId", // Assuming there is a PlanId in Product_metrics model
    as: "product_metrics",
  });

  db.Sub_category.belongsToMany(db.Product, {
    through: "SubCategoryProduct",
  });
  db.Product.belongsToMany(db.Sub_category, {
    through: "SubCategoryProduct",
  });

  // Category -> Sub Categories
  db.Category.hasMany(db.Sub_category, {
    foreignKey: "CategoryId",
    as: "subCategories",
  });
  db.Sub_category.belongsTo(db.Category, {
    foreignKey: "CategoryId",
    as: "category",
  });

  db.User_store.hasMany(db.Address, {
    foreignKey: "UserStoreId",
    as: "addresses",
  });
  db.Address.belongsTo(db.User_store, {
    foreignKey: "UserStoreId",
    as: "userStore",
  });

  db.Order.belongsToMany(db.Variant, { through: "Order_variant" });
  db.Variant.belongsToMany(db.Order, { through: "Order_variant" });

  db.Order_variant.belongsTo(db.Order, { foreignKey: "OrderId", as: "order" });

  db.Order_variant.belongsTo(db.Variant, {
    foreignKey: "VariantId",
    as: "variant",
  });

  db.User_store.hasOne(db.Order);
  db.Order.belongsTo(db.User_store);

  // db.User_store.hasOne(db.Cart, {
  //   foreignKey: "UserStoreId",
  //   as: "cart",
  // });

  db.Cart.belongsTo(db.User_store, {
    foreignKey: "UserStoreId",
    as: "userStore",
  });

  return db.sequelize;
};
