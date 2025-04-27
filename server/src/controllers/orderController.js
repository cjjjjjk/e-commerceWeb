const Order = require(`../models/orderModel`);
const Product = require("../models/productModel");
const Cart = require("./../models/cartModel");
const Category = require(`../models/categoryModel`);
const APIFeatures = require("../utils/apiFeatures");

exports.getAllOrders = async (req, res) => {
  try {
    //Search, filter, sort, limit fields, paginate
    const features = new APIFeatures(Order.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders = await features.query;

    res.status(200).json({
      status: "success",
      numOfOrders: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, discountPrice } = req.body;

    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "fail", message: "Cart not found" });
    }

    if (!items)
      return res.status(404).json({
        status: "fail",
        message: "No items found!",
      });

    // Cập nhật số lượng sản phẩm trong kho
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.productId} not found` });
      }

      // Kiểm tra số lượng trong kho
      if (product.stockMap[item.size] < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      // Giảm số lượng sản phẩm trong kho
      product.stockMap[item.size] -= item.quantity;
      await product.save();
    }

    // Tạo đơn
    const newOrder = await Order.create({
      userId,
      items,
      shippingAddress,
      discountPrice: discountPrice || 0,
    });

    // Xóa các mặt hàng đã đặt khỏi giỏ
    cart.items = cart.items.filter(
      (cartItem) => !items.some((item) => item._id === cartItem._id.toString())
    );
    await cart.save();

    res.status(201).json({
      status: "success",
      data: {
        newOrder,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(1).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllOrdersByUser = async (req, res) => {
  try {
    console.log(req.params.userId);
    const orders = await Order.find({ userId: req.params.userId }).sort(
      "-createdAt"
    );

    res.status(200).json({
      status: "success",
      numOfOrders: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const newStatus = req.body.status;

    if (!newStatus || !allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        status: "fail",
        message:
          "Invalid status value. Allowed values are: pending, confirmed, shipped, delivered, cancelled.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: `No order found with ID: ${req.params.id}`,
      });
    }

    order.status = newStatus;
    await order.save();

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: `Error updating order status: ${err.message}`,
    });
  }
};
