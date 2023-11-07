module.exports = async (sequelize) => {

    const productModel = require('../../product/models/product')(sequelize)
    const productVariantModel = require('../../product-variant/models/product-variant')(sequelize)

    // const mediaModel = require('../../upload/models/media')(sequelize)
    await sequelize.sync()
    await sequelize.close()
}