const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "An order item must have a name!"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "An order item must have a product Id!"],
  },
  price: {
    type: Number,
    required: [true, "An order item must have a price!"],
  },
  quantity: {
    type: Number,
    required: [true, "An order item must have a quantity!"],
    min: 1,
  },
  totalPrice: {
    type: Number,
  },
});

orderItemSchema.pre("save", function (next) {
  this.totalPrice = this.price * this.quantity;
  next();
});

module.exports = orderItemSchema;
