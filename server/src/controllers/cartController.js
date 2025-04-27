const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const userId = req.user._id;
    console.log(userId);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (
      existingItem &&
      existingItem.color === color &&
      existingItem.size === size
    ) {
      existingItem.quantity += quantity;
    } else {
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      console.log(product);

      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.priceMap[size],
        color: color,
        image: product.images[product.colors.indexOf(color)],
        quantity,
        size: size,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== id);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item._id.toString() === id);
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
