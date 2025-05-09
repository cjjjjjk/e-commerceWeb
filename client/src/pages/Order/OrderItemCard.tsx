// src/components/OrderItemCard.tsx
import "./orderCardItem.css";
import React, { useState, useEffect } from "react";
import ReviewModal from "./ReviewModal";
import userService from "shared/services/auth/userService";
import { addToast } from "shared/components/toast/toastSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const URL = process.env.REACT_APP_API_URL;

interface OrderItemCardProps {
  name: string;
  quantity: number;
  price: number;
  statusOrder: string;
  size: string;
  images: string[];
  color: string;
  onReview?: () => void;
  productId: string;
  status: string;
}

const getImage = (images: string[], size: string): string => {
  const sizeIndexMap: Record<string, number> = {
    S: 0,
    M: 1,
    L: 2,
    XL: 3,
  };

  const index = sizeIndexMap[size];
  return images?.[index] ?? images?.[0] ?? "";
};

const OrderItemCard: React.FC<OrderItemCardProps> = ({
  name,
  quantity,
  price,
  statusOrder,
  onReview,
  images,
  color,
  size,
  productId,
  status,
}) => {
  const total = quantity * price;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [itemStatus, setItemStatus] = useState<any>(status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showToast = (
    message: string,
    type: "success" | "error" | "info",
    link?: string
  ) => {
    dispatch(addToast({ message, type, link }));
  };
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

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSubmitReview = async (reviewText: string, rating: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${URL}/reviews`,
        {
          review: reviewText,
          rating: parseInt(rating),
          product: productId,
          user: userData._id,
          status: "rated",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItemStatus("rated");

      showToast("Tạo đánh giá thành công", "success");
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      showToast("Không thể gửi đánh giá. Vui lòng thử lại!", "error");
    }
  };

  return (
    <div className="order-item-card p-3 mb-3 border rounded d-flex flex-column flex-sm-row justify-content-between align-items-center shadow-sm fs-5 gap-2 gap-sm-2">
      <div className="d-flex gap-3 gap-sm-5">
        <img
          src={getImage(images, size)}
          alt={name}
          // style={{ width: "150px", height: "175px" }}
          className="img-thumbnail custom-responsive-img"
        />
        <div className="fs-6 d-flex flex-column gap-1 gap-sm-2 fs-sm-5">
          <div className="fw-bold fs-lg-responsive">{name}</div>
          <div className="fw-semibold fs-responsive">{`Số lượng: ${quantity}`}</div>
          <div className="fw-semibold fs-responsive">{`Phân loại: ${color}, ${size}`}</div>
          <div className="d-flex fw-semibold fs-responsive">
            Thành tiền
            <div className="text-primary fw-bold">
              {`: ${total.toLocaleString()}₫`}
            </div>
          </div>
        </div>
      </div>
      {statusOrder === "delivered" && (
        <button
          className={`btn fs-responsive ${
            status === "unrated" ? "btn-outline-primary" : "btn-outline-success"
          }`}
          onClick={handleShow}
        >
          {status === "unrated" ? "Đánh giá" : "Mua lại"}
        </button>
      )}

      <ReviewModal
        showModal={showModal}
        handleClose={handleClose}
        handleSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default OrderItemCard;
