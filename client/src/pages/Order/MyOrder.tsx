import "./myOrder.css";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import orderService from "shared/services/orderService";
import userService from "shared/services/auth/userService";
import { addToast } from "shared/components/toast/toastSlice";
import OrderCard from "./OrderCard";
import { Loading } from "shared/components";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size: string;
  productId: any;
  color: string;
  status: string;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
}

// const getStatusColorClass = (status: string): string => {
//   switch (status) {
//     case "pending":
//       return "text-secondary";
//     case "confirmed":
//       return "text-primary";
//     case "shipped":
//       return "text-info";
//     case "delivered":
//       return "text-success";
//     case "cancelled":
//       return "text-danger";
//     default:
//       return "text-dark";
//   }
// };

// const renderActionButton = (status: string) => {
//   switch (status) {
//     case "pending":
//       return <button className="btn btn-danger btn-lg">Huỷ đơn</button>;
//     case "confirmed":
//       return (
//         <button className="btn btn-primary btn-lg">Theo dõi đơn hàng</button>
//       );
//     case "shipped":
//       return <button className="btn btn-info btn-lg">Xem vị trí</button>;
//     case "delivered":
//       return <button className="btn btn-success btn-lg">Mua lại</button>;
//     default:
//       return <button className="btn btn-success btn-lg">Mua lại</button>;
//   }
// };

const TABS = [
  { label: "Chờ xác nhận", status: "pending" },
  { label: "Đã xác nhận", status: "confirmed" },
  { label: "Đang giao", status: "shipped" },
  { label: "Đã giao", status: "delivered" },
  { label: "Đã hủy", status: "cancelled" },
];

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<any>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    link?: string
  ) => {
    dispatch(addToast({ message, type, link }));
  };

  // Lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getMe();
        const user = res?.data?.data?.user;
        if (user && user._id) {
          setUserData(user);
        } else {
          showToast("Bạn cần đăng nhập để xem đơn hàng", "info", "/signin");
          navigate("/signin");
        }
      } catch (err) {
        showToast("Không thể xác minh người dùng", "error");
        navigate("/signin");
      }
    };

    fetchUser();
  }, []);

  // Lấy đơn hàng khi đã có userData
  useEffect(() => {
    fetchOrders();
  }, [userData]);

  const fetchOrders = async () => {
    if (!userData?._id) return;

    try {
      const res = await orderService.getMyOrders(); // hoặc truyền userId nếu cần
      setOrders(res.data.orders ?? []);
    } catch (err) {
      setError("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Đang tải đơn hàng của bạn..."/>
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="container my-5 mt-0">
      <br />
      <br />
      <br />
      <span className="list-label text-start mb-3 ">{"đơn hàng của bạn".toUpperCase()}</span>
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4 d-flex nav-pills nav-fill overflow-auto flex-row">
        {TABS.map((tab) => (
          <li className="nav-item" key={tab.status}>
            <button
              type="button"
              className={`nav-link btn-sm btn-lg fs-lg-responsive ${
                activeTab === tab.status ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.status)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <p>Không có đơn hàng ở trạng thái này.</p>
      ) : (
        filteredOrders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            statusOrder={activeTab}
            // renderActionButton={renderActionButton}
            onReview={(itemName) => alert(`Đánh giá ${itemName}`)}
            onStatusChange={fetchOrders}
          />
        ))
      )}
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    </div>
  );
};

export default UserOrders;
