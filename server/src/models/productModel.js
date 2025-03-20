const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must have a name"],
  },
  description: {
    type: String,
    required: [true, "A product must have a description"],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsCount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, "A product must have stock!"],
  },
  sold: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String], // Mảng chứa link ảnh
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  gender: {
    type: Number,
    required: [true, "A product must have a gender category!"],
    enum: [0, 1, 2], // 0: Unisex, 1: Male, 2: Female
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "A product must have a category"],
  },
});

module.exports = mongoose.model("Product", productSchema);
