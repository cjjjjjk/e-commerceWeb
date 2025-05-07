import React, { useState } from "react";
import OrderItemCard from "./OrderItemCard";
import { useDispatch } from "react-redux";
import {
  CancelOrderButton,
  TrackOrderButton,
  ViewLocationButton,
  ReorderButton,
} from "./OrderActionButtons";
import CancelOrderModal from "./CancelOrderModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addToast } from "shared/components/toast/toastSlice";

const URL = process.env.REACT_APP_API_URL;

interface Product {
  _id: string;
  images: string[];
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  productId: Product;
  status: string;
}

interface OrderType {
  _id: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
  status: string;
}

interface OrderCardProps {
  order: OrderType;
  statusOrder: string;
  //   renderActionButton: (status: string) => React.ReactNode;
  onReview: (itemName: string) => void;
  onStatusChange: () => void;
}

const getStatusColorClass = (status: string): string => {
  switch (status) {
    case "pending":
      return "text-secondary";
    case "confirmed":
      return "text-primary";
    case "shipped":
      return "text-info";
    case "delivered":
      return "text-success";
    case "cancelled":
      return "text-danger";
    default:
      return "text-dark";
  }
};

const renderActionButton = (status: string, onClick: () => void): any => {
  switch (status) {
    case "pending":
      return <CancelOrderButton onClick={onClick} />;
    case "confirmed":
      return <TrackOrderButton onClick={onClick} />;
    case "shipped":
      return <ViewLocationButton onClick={onClick} />;
    case "delivered":
      return <ReorderButton onClick={onClick} />;
    default:
      return <ReorderButton onClick={onClick} />;
  }
};

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

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  statusOrder,
  onReview,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<string>(statusOrder);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    link?: string
  ) => {
    dispatch(addToast({ message, type, link }));
  };

  const addToCart = async ({
    product,
    quantity,
    color,
    size,
  }: {
    product: string;
    quantity: number;
    color: string;
    size: string;
  }) => {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${URL}/carts/addItem`,
      {
        productId: product,
        quantity,
        color,
        size,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // <-- Gửi token ở đây
        },
      }
    );
    return response.data;
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };
  const handleTrack = () => {
    alert("Theo dõi đơn hàng");
  };
  const handleViewLocation = () => {
    alert("Xem vị trí");
  };
  const handleReorder = async () => {
    try {
      const promises = order.items.map((item) =>
        addToCart({
          product: item.productId._id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })
      );
      await Promise.all(promises);
      navigate("/cart");
    } catch (error) {
      console.error("Lỗi khi mua lại:", error);
      alert("Đã xảy ra lỗi khi thêm vào giỏ hàng");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${URL}/orders/${order._id}`,
        {
          status: "cancelled",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus("pending");
      setShowCancelModal(false);


      showToast("Hủy đơn hàng thành công", "success");
      onStatusChange();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      showToast("Không thể hủy đơn hàng. Vui lòng thử lại!", "error");
    }
  };

  const actions: any = {
    pending: handleCancel,
    confirmed: handleTrack,
    shipped: handleViewLocation,
    delivered: handleReorder,
    cancelled: handleReorder,
  };

  return (
    <div key={order._id} className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <div>
            <p className="mb-1 fw-semibold fs-lg-responsive fs-sm-5 d-sm-block d-none">
              Mã đơn: {order._id}
            </p>
            <p className="mb-1 text-muted fs-lg-responsive fs-sm-5">
              Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="text-end">
            <p
              className={`fs-sm-5 mb-1 fs-lg-responsive fw-bold text-capitalize ${getStatusColorClass(
                order.status
              )}`}
            >
              {order.status}
            </p>
            <p className="mb-0 fw-bold fs-sm-5 fs-lg-responsive">
              {typeof order.totalPrice === "number"
                ? `${order.totalPrice.toLocaleString()}₫`
                : "Không rõ"}
            </p>
          </div>
        </div>

        <ul className="ps-0">
          {order.items.map((item, idx) => (
            <OrderItemCard
              statusOrder={statusOrder}
              key={idx}
              name={item.name}
              quantity={item.quantity}
              price={item.price}
              images={item.productId.images}
              size={item.size}
              color={item.color}
              productId={item.productId._id}
              status={item.status}
              onReview={() => onReview(item.name)}
            />
          ))}
        </ul>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
          {renderActionButton(order.status, actions[order.status])}
        </div>
        <CancelOrderModal
          show={showCancelModal}
          handleClose={() => setShowCancelModal(false)}
          handleConfirm={handleCancelOrder}
        />
      </div>
    </div>
  );
};

export default OrderCard;
