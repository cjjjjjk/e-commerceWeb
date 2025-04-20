const Product = require(`../models/productModel`);
const Category = require(`../models/categoryModel`);
const APIFeatures = require("../utils/apiFeatures");

exports.getAllProducts = async (req, res) => {
  try {
    //Search, filter, sort, limit fields, paginate
    const features = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products = await features.query;

    res.status(200).json({
      status: "success",
      numOfProducts: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id)
      .populate("reviews")
      .populate("categoryId");

    // HaiHv: return product only
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        status: "fail",
        message: "CategoryId không hợp lệ! Danh mục không tồn tại.",
      });
    }

    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newProduct,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(201).json({
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
