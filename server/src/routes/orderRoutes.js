const express = require("express");

const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin"), orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrderStatus)
  .delete(orderController.deleteOrder);

router.route("/users/:userId").get(orderController.getAllOrdersByUser);

module.exports = router;
