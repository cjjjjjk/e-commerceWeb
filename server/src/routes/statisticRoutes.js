const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticController");

router.get("/revenue", statisticsController.getRevenueStats);
router.get("/orders", statisticsController.getOrderStats);
router.get("/monthly", statisticsController.getMonthlyStats);

router.get("/best-sellers", statisticsController.getBestSellers);

// Thống kê sản phẩm tồn kho nhiều nhất
router.get("/most-stock", statisticsController.getMostStock);

// Thống kê sản phẩm bị trả lại nhiều nhất
router.get("/most-returned", statisticsController.getMostReturned);

module.exports = router;
