const express = require(`express`);

const reviewRouter = require("../routes/reviewRoutes");
const productController = require(`../controllers/productController`);
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route(`/`)
  .get(
    // authController.protect,
    // authController.restrictTo("admin"),
    productController.getAllProducts
  )
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct
  );

router
  .route(`/:id`)
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );

router.use("/:productId/reviews", reviewRouter);

module.exports = router;
