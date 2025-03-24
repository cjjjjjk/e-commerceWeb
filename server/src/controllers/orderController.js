const Order = require(`../models/orderModel`);
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

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, discountPrice } = req.body;
    const newOrder = await Order.create({
      userId,
      items,

      discountPrice: discountPrice || 0,
    });

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
