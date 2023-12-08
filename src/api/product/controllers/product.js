const { getPagination, getMeta } = require("../../../services/pagination");
const { requestError } = require("../../../services/errors");
const { Op, literal, or } = require("sequelize");
const blukTag = require("../services/blukTag");
const orderBy = require("../../../services/orderBy");

exports.create = async (req, res) => {
  try {
    const sequelize = req.db;
    const body = req.body;
    const variants = body.variants;
    const product = await sequelize.models.Product.create({
      name: body.name,
      description: body.description,
      CategoryId: body.CategoryId,
      CollectionId: body.CollectionId,
      CollectionStaticId: body.CollectionStaticId,
      ThumbnailId: body.ThumbnailId,
      shipping_value: body.shipping_value,
      shipping_value_type: body.shipping_value_type,
    });

    let variantArray = [];
    for (const variant of variants) {
      variantArray.push({
        name: variant.name,
        price: variant.price,
        quantity: variant.quantity,
        ProductId: product.id,
        from: variant.from,
        to: variant.to,
        ThumbnailId: variant.ThumbnailId,
      });
    }
    const createdVariants = await sequelize.models.Variant.bulkCreate(
      variantArray
    );

    const tags = body.tags;
    let createdTags;
    if (tags.length > 0) {
      createdTags = await blukTag({ sequelize, tags, ProductId: product.id });
    }
    return res.status(200).send({
      message: "Product and variants created successfully!",
      data: { product, variants: createdVariants, tags: createdTags || null },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to create a product" });
  }
};

exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const query = req.query;
    const category_id = req.query.category;
    const minPrice = parseFloat(query.price.min) || 0;
    const maxPrice = parseFloat(query.price.max) || Number.MAX_SAFE_INTEGER;

    const pagination = await getPagination(query.pagination);
    const order = orderBy(query, sequelize);

    console.log(order);

    const products = await sequelize.models.Product.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: order,

      where: {
        ...(category_id ? { CategoryId: category_id } : {}),
      },
      include: [
        {
          model: sequelize.models.Variant,
          as: "variants",
          where: {
            price: {
              [Op.between]: [minPrice, maxPrice],
            },
          },
        },
      ],
    });

    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch products" });
  }
};

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const product = await sequelize.models.Product.findByPk(id, {
      include: [
        {
          model: sequelize.models.Variant,
          as: "variants",
          include: ["thumbnail"],
        },
        {
          model: sequelize.models.Category,
          as: "category",
        },
        "thumbnail",
        "tags",
      ],
    });
    if (!product) {
      return res
        .status(400)
        .send(requestError({ message: "Invalid Id to fetch product" }));
    }

    const existingProductMetrics =
      await sequelize.models.Product_metrics.findOne({
        ProductId: product.ProductId,
      });

    if (existingProductMetrics) {
      await existingProductMetrics.update({
        view_count: existingProductMetrics.view_count + 1,
      });
    } else {
      let productMetrics = await sequelize.models.Product_metrics.create({
        view_count: 1,
      });
    }
    return res.status(200).send(product);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch product" });
  }
};

exports.update = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const getProduct = await sequelize.models.Product.findByPk(id);
    if (getProduct) {
      const product = await sequelize.models.Product.update(req.body, {
        where: { id },
        returning: true,
      });
      return res
        .status(200)
        .send({ message: "product updated successfully!", data: product });
    } else {
      return res.status(400).send(
        requestError({
          message: "Invalid Product ID",
          details: "Requested Product Id Does not exists",
        })
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch product" });
  }
};

exports.delete = async (req, res) => {
  try {
    const sequelize = req.db;
    const { id } = req.params;
    const getProduct = await sequelize.models.Product.findByPk(id);
    if (!getProduct) {
      return res
        .status(400)
        .send(requestError({ message: "Invalid Product ID" }));
    }
    const product = await sequelize.models.Product.destroy({ where: { id } });
    return res.status(200).send({ message: "product deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch product" });
  }
};

exports.search = async (req, res) => {
  try {
    const sequelize = req.db;
    const query = req.query;
    const qs = query.qs.trim();
    const pagination = await getPagination(query.pagination);

    const products = await sequelize.models.Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${qs}%` } },
          { description: { [Op.iLike]: `%${qs}%` } },
          literal(
            `EXISTS (SELECT * FROM "Variants" AS "variants" WHERE "Product"."id" = "variants"."ProductId" AND "variants"."name" ILIKE '%${qs}%')`
          ),
        ],
      },
      offset: pagination.offset,
      limit: pagination.limit,
      distinct: true,
      include: [
        {
          model: sequelize.models.Variant,
          as: "variants",
        },

        {
          model: sequelize.models.Category,
          as: "category",
        },
        {
          model: sequelize.models.Tag,
          as: "tags",
        },
      ],
    });
    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

exports.findByPrice = async (req, res) => {
  try {
    const sequelize = req.db;
    const query = req.query;
    const pagination = await getPagination(query.pagination);
    const orderBy = query.orderBy
      ? [Object.keys(query.orderBy)[0], query.orderBy.id]
      : ["id", "desc"];
    const price = query.price;
    const products = await sequelize.models.Product.findAndCountAll({
      offset: pagination.offset,
      limit: pagination.limit,
      order: [orderBy],
      distinct: true,
      include: [
        {
          model: sequelize.models.Variant,
          as: "variants",
          include: ["thumbnail"],
          where: {
            [Op.and]: [
              {
                price: {
                  [Op.gte]: price.min,
                },
              },
              {
                price: {
                  [Op.lte]: price.max,
                },
              },
            ],
          },
        },
        {
          model: sequelize.models.Media,
          as: "thumbnail",
        },
        {
          model: sequelize.models.Category,
          as: "category",
        },
        "tags",
      ],
    });
    const meta = await getMeta(pagination, products.count);
    return res.status(200).send({ data: products.rows, meta });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

exports.findNRandom = async (req, res) => {
  try {
    const sequelize = req.db;
    const n = req.params.n || 1;

    console.log("this is a random" + n);

    const products = await sequelize.models.Product.findAll({
      order: sequelize.literal("RANDOM()"),
      limit: n,
    });

    return res.status(200).send(products);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch products" });
  }
};

exports.findNRandomInCategory = async (req, res) => {
  try {
    const sequelize = req.db;
    const n = req.params.n || 1;

    console.log("this is a random" + n);

    const products = await sequelize.models.Product.findAll({
      where: {
        CategoryId: req.params.id,
      },
      order: sequelize.literal("RANDOM()"),
      limit: n,
    });

    return res.status(200).send(products);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch products" });
  }
};
