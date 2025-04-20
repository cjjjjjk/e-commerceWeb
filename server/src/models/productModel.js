const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    stockMap: {
      S: { type: Number, min: 0 },
      M: { type: Number, min: 0 },
      L: { type: Number, min: 0 },
      XL: { type: Number, min: 0 },
    },
    soldMap: {
      S: { type: Number, min: 0 },
      M: { type: Number, min: 0 },
      L: { type: Number, min: 0 },
      XL: { type: Number, min: 0 },
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
      type: String,
      required: [true, "A product must have a gender category!"],
      enum: ["Nam", "Nữ", "Tất cả"], // 0: Unisex, 1: Male, 2: Female
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A product must have a category"],
    },
    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL"],
      required: [true, "A product must have available sizes!"],
    },
    priceMap: {
      S: { type: Number, min: 0 },
      M: { type: Number, min: 0 },
      L: { type: Number, min: 0 },
      XL: { type: Number, min: 0 },
    },
    colors: {
      type: [String],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
