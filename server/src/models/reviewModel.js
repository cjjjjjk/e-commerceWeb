const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review must not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A review should belong to a user!"],
      ref: "User",
    },
    product: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A review should belong to a product!"],
      ref: "Product",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Reference to User
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "displayName",
  });

  next();
});

//Automatic calculate product's rating when a review is created, updated and deleted
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);
  if (stats.length) {
    await Product.findByIdAndUpdate(productId, {
      ratingsCount: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsCount: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
