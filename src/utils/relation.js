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

// const services = require("../api/product/services/services")

module.exports = async (sequelize) => {
  // Product relations
  const db = {};
  // services(sequelize)
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
  db.CartVariant = cart_variant(sequelize);
  db.Campaign = campaign(sequelize);
  db.Tutorial = tutorial(sequelize);
  db.Bulk_pricing = bulkPricing(sequelize);
  db.Collection = collection(sequelize);
  db.Collection_static = collection_static(sequelize);

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

  return db.sequelize;
};
