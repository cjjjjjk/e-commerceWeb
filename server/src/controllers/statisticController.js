const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.getRevenueStats = async (req, res) => {
  const { from, to } = req.query;
  console.log(from, to);
  const fromDate = new Date(from);
  let toDate;
  if (to) {
    toDate = new Date(to);
  } else toDate = new Date();

  console.log(fromDate, toDate);

  try {
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          status: "delivered",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalRevenue = orders.reduce((acc, cur) => acc + cur.totalRevenue, 0);
    const ordersCount = orders.reduce((acc, cur) => acc + cur.ordersCount, 0);

    res.json({
      totalRevenue,
      ordersCount,
      dailyRevenue: orders.map((o) => ({
        date: o._id,
        revenue: o.totalRevenue,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getMonthlyStats = async (req, res) => {
//   try {
//     const year = parseInt(req.query.year);

//     const monthlyStats = await Order.aggregate([
//       {
//         $match: {
//           createdAt: {
//             $gte: new Date(`${year}-01-01`),
//             $lt: new Date(`${year + 1}-01-01`),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           orders: { $sum: 1 },
//           revenue: { $sum: "$totalPrice" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           month: {
//             $cond: [
//               { $lt: ["$_id", 10] },
//               { $concat: ["0", { $toString: "$_id" }] },
//               { $toString: "$_id" },
//             ],
//           },
//           orders: 1,
//           revenue: 1,
//         },
//       },
//       {
//         $sort: { month: 1 },
//       },
//     ]);

//     res.json(monthlyStats);
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error });
//   }
// };

exports.getOrderStats = async (req, res) => {
  const { from, to } = req.query;
  const fromDate = new Date(from);
  const toDate = new Date(to);

  try {
    const orders = await Order.find({
      createdAt: { $gte: fromDate, $lte: toDate },
    });

    const statusCount = {
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

    const dailyOrders = {};

    orders.forEach((order) => {
      const dateStr = order.createdAt.toISOString().split("T")[0];
      dailyOrders[dateStr] = (dailyOrders[dateStr] || 0) + 1;
      statusCount[order.status]++;
    });

    res.json({
      totalOrders: orders.length,
      ...statusCount,
      dailyOrders: Object.entries(dailyOrders).map(([date, count]) => ({
        date,
        count,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year); // ví dụ: /monthly?year=2024

    // Truy vấn để lấy thống kê doanh thu theo tháng và loại đơn hàng trong tháng
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 }, // Số lượng đơn hàng trong tháng
          totalRevenue: { $sum: "$totalPrice" }, // Tổng doanh thu của đơn hàng
          orderStatus: {
            $push: { status: "$status", price: "$totalPrice" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $cond: [
              { $lt: ["$_id", 10] },
              { $concat: ["0", { $toString: "$_id" }] },
              { $toString: "$_id" },
            ],
          },
          totalOrders: 1,
          totalRevenue: 1,
          orderStatus: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Phân loại theo trạng thái đơn hàng trong từng tháng
    const categorizedStats = monthlyStats.map((stat) => {
      const statusCount = {
        pending: 0,
        shipped: 0,
        canceled: 0,
        delivered: 0,
      };
      let monthlyRevenue = 0;

      stat.orderStatus.forEach((order) => {
        // Cộng doanh thu theo trạng thái đơn
        monthlyRevenue += order.price;

        // Phân loại trạng thái đơn
        if (order.status === "pending") {
          statusCount.pending += 1;
        } else if (order.status === "shipped") {
          statusCount.shipped += 1;
        } else if (order.status === "canceled") {
          statusCount.canceled += 1;
        } else if (order.status === "delivered") {
          statusCount.delivered += 1;
        }
      });

      return {
        month: stat.month,
        totalOrders: stat.totalOrders,
        totalRevenue: stat.totalRevenue,
        statusCount: statusCount,
        monthlyRevenue: monthlyRevenue,
      };
    });

    res.json(categorizedStats);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    // Sản phẩm bán chạy nhất (Theo số lượng bán)
    const bestSellers = await Product.find()
      .sort({ sold: -1 }) // Sắp xếp giảm dần theo số lượng bán
      .limit(5); // Lấy 5 sản phẩm bán chạy nhất
    res.json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getMostStock = async (req, res) => {
  try {
    // Sản phẩm tồn kho nhiều nhất
    const mostStock = await Product.find()
      .sort({ stock: -1 }) // Sắp xếp giảm dần theo tồn kho
      .limit(5); // Lấy 5 sản phẩm tồn kho nhiều nhất
    res.json(mostStock);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.getMostReturned = async (req, res) => {
  try {
    // Sản phẩm bị trả lại nhiều nhất
    const mostReturned = await Product.find()
      .sort({ returned: -1 }) // Sắp xếp giảm dần theo số lượng trả lại
      .limit(5); // Lấy 5 sản phẩm bị trả lại nhiều nhất
    res.json(mostReturned);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
