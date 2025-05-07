import { useEffect, useState } from "react";
import adminService from "../services/adminService";
import './statistic.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { Loading } from "shared/components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Statistic() {
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [mostStock, setMostStock] = useState<any[]>([]);
  const [mostReturned, setMostReturned] = useState<any[]>([]);

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const navigate = useNavigate();

  const fetchStats = async (from: string, to: string) => {
    setLoading(true);
    try {
      const [revenue, orders, best, stock, returned] = await Promise.all([
        adminService.getRevenueStats(from, to),
        adminService.getOrderStats(from, to),
        adminService.getBestSellers(),
        adminService.getMostStock(),
        adminService.getMostReturned(),
      ]);

      setRevenueStats(revenue.data);
      setOrderStats(orders.data);
      setBestSellers(best.data);
      setMostStock(stock.data);
      setMostReturned(returned.data);
    } catch (err) {
      console.error("Fetch statistic failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const formatDate = (d: Date) => d.toISOString().split("T")[0];
  
    const today = new Date();
    const from = formatDate(new Date(today.setDate(today.getDate() - 7)));
    const to = formatDate(new Date(Date.now() + 86400000));
  
    setFromDate(from);
    setToDate(to);
  
    fetchStats(from, to);
  }, []);
  
  if (loading) {
    return (
      <Loading message="Đang tính toán dữ liệu..."/>
    );
  }

  const dailyRevenueChart =
    revenueStats?.dailyRevenue?.length > 0
      ? {
          labels: revenueStats.dailyRevenue.map((d: any) => d.date),
          datasets: [
            {
              label: "Doanh thu (VND)",
              data: revenueStats.dailyRevenue.map((d: any) => d.revenue),
              fill: true,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
            },
          ],
        }
      : null;

  const dailyOrdersChart =
    orderStats?.dailyOrders?.length > 0
      ? {
          labels: orderStats.dailyOrders.map((d: any) => d.date),
          datasets: [
            {
              label: "Số đơn hàng",
              data: orderStats.dailyOrders.map((d: any) => d.count),
              backgroundColor: "rgba(70, 162, 237, 0.8)",
            },
          ],
        }
      : null;

      const orderStatusChart = orderStats
      ? {
          labels: [
            "Chờ xác nhận",
            "Đã hủy",
            "Đã xác nhận",
            "Đã giao",
            "Đang vận chuyển"
          ],
          datasets: [
            {
              label: "Trạng thái đơn hàng",
              data: [
                orderStats.pending ?? 0,
                orderStats.cancelled ?? 0,
                orderStats.confirmed ?? 0,
                orderStats.delivered ?? 0,
                orderStats.shipped ?? 0,
              ],
              backgroundColor: [
                "#ffc107",
                "#dc3545",
                "#0d6efd",
                "#20c997",
                "#6f42c1",
              ],
            },
          ],
        }
      : null;
      const orderStatusBarChart = orderStats
      ? {
          labels: [
            "Chờ xử lý",
            "Đã hủy",
            "Đã xác nhận",
            "Đã giao",
            "Đang vận chuyển"
          ],
          datasets: [
            {
              label: "Số lượng đơn hàng",
              data: [
                orderStats.pending ?? 0,
                orderStats.cancelled ?? 0,
                orderStats.confirmed ?? 0,
                orderStats.delivered ?? 0,
                orderStats.shipped ?? 0,
              ],
              backgroundColor: [
                "#ffc107",
                "#dc3545",
                "#0d6efd",
                "#20c997",
                "#6f42c1",
              ],
            },
          ],
        }
      : null;

  return (
    <div className="container static-container">
      <h2 className="mb-4 fw-bold">
        {"Thống kê hệ thống".toUpperCase()}{" "}
        <button className="btn btn-link" onClick={() => navigate("/admin")}>
          Quay lại
        </button>
      </h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body">
              <h4 className="card-title">Tổng doanh thu</h4>
              <p className="card-text fs-4 text-success">
                {revenueStats?.totalRevenue?.toLocaleString() ?? "0"} VND
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-info">
            <div className="card-body">
              <h4 className="card-title">Đã giao:</h4>
              <p className="card-text fs-4">
                <strong>
                {String(revenueStats?.ordersCount ?? 0)+" Đơn hàng"}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <label>Từ ngày</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>Đến ngày</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={() => fetchStats(fromDate, toDate)}
            disabled={!fromDate || !toDate}
          >
            Lọc thống kê
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Biểu đồ doanh thu theo ngày</h4>
          {dailyRevenueChart ? (
            <Line data={dailyRevenueChart} />
          ) : (
            <p>Không có dữ liệu doanh thu.</p>
          )}
        </div>
        <div className="col-md-6">
          <h4>Biểu đồ số đơn hàng theo ngày</h4>
          {dailyOrdersChart ? (
            <Bar data={dailyOrdersChart} />
          ) : (
            <p>Không có dữ liệu đơn hàng.</p>
          )}
        </div>
      </div>

  <hr />
  <div className="row mb-4">
    <div className="col-md-4">
      <h4>Thống kê trạng thái: <strong>{`${orderStats.totalOrders} đơn hàng`}</strong></h4>
      {orderStatusChart ? (
        <Pie data={orderStatusChart} />
      ) : (
        <p>Không có dữ liệu trạng thái đơn hàng.</p>
      )}
    </div>
    <div className="col-md-8">
      <h4></h4>
      {orderStatusBarChart ? (
        <Bar data={orderStatusBarChart} options={{ responsive: true }} />
      ) : (
        <p>Không có dữ liệu đơn hàng theo tháng.</p>
      )}
    </div>
  </div>
  <hr />

      <div className="row">
        <div className="col-md-4">
          <h4>Bán chạy nhất:</h4>
          <ul className="list-group">
            {bestSellers.map((product) => (
              <li
                key={product._id}
                className="list-group-item d-flex justify-content-between"
              >
                {product.name}
                <span className="badge bg-success">{product.sold}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-4">
          <h4>Tồn kho nhiều nhất:</h4>
          <ul className="list-group">
            {mostStock.map((product) => (
              <li
                key={product._id}
                className="list-group-item d-flex justify-content-between"
              >
                {product.name}
                <span className="badge bg-warning text-dark">
                  {product.stock}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-4">
          <h4>Trả lại nhiều nhất:</h4>
          <ul className="list-group">
            {mostReturned.map((product) => (
              <li
                key={product._id}
                className="list-group-item d-flex justify-content-between"
              >
                {product.name}
                <span className="badge bg-danger">{product.returned}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
