const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Store_setting = sequelize.define(
    "Store_setting",
    {
      store_mode: {
        type: DataTypes.ENUM(["WHATSAPP", "B2B", "ECOM", "RESELLER_ECOM"]),
      },
      primary_color: {
        type: DataTypes.STRING,
      },
      secondary_color: {
        type: DataTypes.STRING,
      },
      bg_color: {
        type: DataTypes.STRING,
      },
      text_color: {
        type: DataTypes.STRING,
      },
      button_color: {
        type: DataTypes.STRING,
      },
      is_app_enabled: {
        type: DataTypes.BOOLEAN,
      },
      is_maintenance_mode: {
        type: DataTypes.BOOLEAN,
      },
      is_store_active: {
        type: DataTypes.BOOLEAN,
      },
      store_inactive_message: {
        type: DataTypes.TEXT,
      },
      store_maintenance_message: {
        type: DataTypes.TEXT,
      },
      is_pricing_visible: {
        type: DataTypes.BOOLEAN,
      },
      is_cart_enabled: {
        type: DataTypes.BOOLEAN,
      },
      is_wallet_enabled: {
        type: DataTypes.BOOLEAN,
      },
      product_card_style: {
        type: DataTypes.ENUM(["PORTRAIT", "SQUARE"]),
      },
      category_card_style: {
        type: DataTypes.ENUM(["LANDSCAPE", "SQUARE"]),
      },
      product_list_span_mobile: {
        type: DataTypes.INTEGER,
      },
      product_list_span_desktop: {
        type: DataTypes.INTEGER,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["id"],
        },
      ],
    }
  );
  return Store_setting;
};
