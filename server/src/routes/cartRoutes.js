const express = require("express");

const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(cartController.getCart);

router.route("/addItem").patch(cartController.addToCart);

router.route("/deleteItem").patch(cartController.removeFromCart);

router.route("/updateItem").patch(cartController.updateQuantity);

module.exports = router;
