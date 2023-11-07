const cart = require("../models/cart");
const { handleVariantsTotalPrice } = require("../services/cart");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.create = async (req, res) => {
  try {
    const sequelize = req.db;

    const cart = await sequelize.models.Cart.create(req.body);
    return res
      .status(200)
      .send({ message: "Cart Created Successfully!", data: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message || "Some error occurred while creating the Cart.",
    });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.find = async (req, res) => {
  try {
    const sequelize = req.db;
    const cart = await sequelize.models.Cart.findAll();
    return res.status(200).send(cart);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Failed to fetch banners" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.findOne = async (req, res) => {
  try {
    const sequelize = req.db;
    const { cartId } = req.params;

    const cart = await sequelize.models.Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).send({
        message: `Cart with id ${cartId} not found.`,
      });
    }

    const cartVariants = await sequelize.models.CartVariant.findAll({
      include: [{ model: sequelize.models.Cart, where: { id: cartId } }],
    });

    const variantsWithTotalPrice = await handleVariantsTotalPrice(
      cartVariants,
      sequelize
    );

    return res.status(200).send({
      cartVariants: variantsWithTotalPrice,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving the cart.",
    });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.addToCart = async (req, res) => {
  try {
    const sequelize = req.db;
    const { variantQuantities } = req.body;

    const { cartId } = req.params;

    const cart = await sequelize.models.Cart.findByPk(cartId);

    for (const variantQuantity of variantQuantities) {
      const { VariantId, quantity } = variantQuantity;

      const existingCartVariant = await sequelize.models.CartVariant.findOne({
        where: {
          VariantId: VariantId,
          CartId: cart.id,
        },
      });

      if (existingCartVariant) {
        existingCartVariant.quantity += quantity;
        await existingCartVariant.save();
      } else {
        await sequelize.models.CartVariant.create({
          VariantId: VariantId,
          CartId: cart.id,
          quantity: quantity,
        });
      }

      const variant = await sequelize.models.Variant.findByPk(VariantId);
      cart.totalPrice += variant.price * quantity;
    }

    await cart.save();

    return res
      .status(200)
      .send({ message: "Variants added to cart successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.findUserCart = async (req, res) => {
  try {
    const UserId = req.params.userId;

    const cartVariants = await CartVariant.findAll({
      include: [
        { model: db.carts, where: { UserId: UserId } },
        { model: db.variants },
      ],
    });

    console.log(cartVariants);
    if (!cartVariants) {
      return res.status(404).send({
        message: `No cart variants found for user with id=${userId}`,
      });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const cartVariant of cartVariants) {
      totalPrice += cartVariant.quantity * cartVariant.Variant.price;
    }

    // Add total price to each variant
    const variantsWithTotalPrice = cartVariants.map((cartVariant) => {
      return {
        ...cartVariant.toJSON(),
        totalVariantPrice: cartVariant.quantity * cartVariant.Variant.price,
      };
    });

    return res.status(200).send({
      cartVariants: variantsWithTotalPrice,
      totalPrice: totalPrice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.emptyCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const sequelize = req.db;

    const cart = await sequelize.models.Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).send({
        message: `Cart with id=${cartId} not found.`,
      });
    }

    const numDeleted = await sequelize.models.CartVariant.destroy({
      where: { CartId: cart.id },
    });

    await cart.update({ totalPrice: 0 });

    if (numDeleted > 0) {
      return res.status(200).send({
        message: "Cart was emptied successfully!",
      });
    } else {
      return res.status(204).send({
        message: `No cart items found for cart with id=${cartId}.`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const sequelize = req.db;
    const { cartId, variantId } = req.params;

    const cart = await sequelize.models.Cart.findByPk(cartId);

    if (!cart) {
      return res.status(404).send({
        message: `Cart with id ${cartId} not found.`,
      });
    }

    if (variantId) {
      const cartVariant = await sequelize.models.CartVariant.findOne({
        where: {
          VariantId: variantId,
          CartId: cartId,
        },
        include: [sequelize.models.Variant],
      });

      if (!cartVariant) {
        return res.status(404).send({
          message: `Variant with id ${variantId} not found in the cart.`,
        });
      }

      const totalPriceReduction =
        cartVariant.Variant.price * cartVariant.quantity;

      await cartVariant.destroy();

      cart.totalPrice -= totalPriceReduction;
      await cart.save();

      return res.status(200).send({
        message: `Variant with id ${variantId} deleted from the cart successfully.`,
      });
    } else {
      const numDeleted = await sequelize.models.CartVariant.destroy({
        where: { CartId: cart.id },
      });

      await cart.update({ totalPrice: 0 });

      if (numDeleted >= 0) {
        return res.status(200).send({
          message: "Cart was emptied successfully!",
        });
      } else {
        return res.status(204).send({
          message: `No cart items found for cart with id=${cartId}.`,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
