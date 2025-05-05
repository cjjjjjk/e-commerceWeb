const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  image: {
    type: String,
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: ["S", "M", "L", "XL"],
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", function (next) {
  if (this.items.length === 0) return next();
  this.totalPrice = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  next();
});

cartSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const cart = await this.model.findOne(this.getQuery());

  const items = update.items || cart.items;

  update.totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  next();
});

module.exports = mongoose.model("Cart", cartSchema);
