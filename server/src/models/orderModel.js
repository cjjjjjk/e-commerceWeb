const mongoose = require("mongoose");
const orderItemSchema = require("./orderItemModel");

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
});

orderSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.totalPrice, 0);
  next();
});

orderSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const order = await this.model.findOne(this.getQuery());

  const items = update.items || order.items;

  const discountPrice = update.discountPrice ?? order.discountPrice;

  update.totalPrice =
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) -
    discountPrice;

  next();
});

module.exports = mongoose.model("Order", orderSchema);
