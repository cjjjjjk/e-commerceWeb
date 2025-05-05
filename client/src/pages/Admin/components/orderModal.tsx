import React, { useState, useEffect } from "react";

interface OrderItem {
  name: string;
  productId: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
}

interface Order {
  _id: string;
  userId: string;
  discountPrice: number;
  status: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  totalPrice: number;
}

interface Props {
  order: Order | null;
  onClose: () => void;
  onSave: (status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled") => Promise<void>;
}

export const getStatusMeta = (status: string): { label: string, style: string } => {
    switch (status) {
        case "pending":
            return { label: "Chờ xử lý", style: "btn-outline-secondary" };
        case "confirmed":
            return { label: "Đã xác nhận", style: "btn-outline-primary" };
        case "shipped":
            return { label: "Đã gửi hàng", style: "btn-outline-warning" };
        case "delivered":
            return { label: "Đã giao", style: "btn-outline-success" };
        case "cancelled":
            return { label: "Đã hủy", style: "btn-outline-danger" };
        default:
            return { label: "Không rõ", style: "btn-outline-dark" };
    }
};

const statusOptions = ["pending" , "confirmed" , "shipped" , "delivered" , "cancelled"];

export default function OrderModal({ order, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [targetStatus, setTargetStatus] = useState<string>(order?.status || "pending");

  useEffect(() => {
    if (order) {
      setTargetStatus(order.status);
    }
  }, [order]);

  const handleSave = async () => {
    if (!order) return;
    setLoading(true);

    try {
      await onSave(targetStatus as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled");
    } catch (error) {
      console.error("Error saving order status:", error);
    } finally {
      setLoading(false);
    }
  };

  const onStatusChange = (status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled") => {
    setTargetStatus(status);
  };

  if (!order) return null;

  return (
    <div className="modal show d-block mt-xl-5" tabIndex={-1}>
      <div className="modal-dialog modal-lg mt-xl-5">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Chi tiết đơn hàng</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Tên khách hàng:<strong>  {order.shippingAddress.name}</strong></p>
            <p>Điện thoại:<strong>  {order.shippingAddress.phone}</strong></p>
            <p>Địa chỉ nhận hàng:<strong>  {order.shippingAddress.address}</strong></p>
            <p>Ngày tạo:<strong>  {new Date(order.createdAt).toLocaleString()}</strong></p>
            <p>Tổng tiền:<strong>  {order.totalPrice.toLocaleString()} đ</strong></p>

            <div className="mb-3">
              <label className="form-label">Trạng thái đơn hàng: <strong className={"btn "+ getStatusMeta(targetStatus).style}>{getStatusMeta(targetStatus).label}</strong></label>
              <select
                className="form-select"
                value={targetStatus}
                onChange={(e) => {
                  onStatusChange(e.target.value as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled");
                }}
              >
                {statusOptions.map((status) => (
                   <option key={status} value={status}>{getStatusMeta(status).label}</option>
                ))}
              </select>
            </div>

            <hr />
            <h6>Sản phẩm:</h6>
            <ul className="list-group">
              {order.items.map((item, idx) => (
                <li className="list-group-item" key={idx}>
                  <strong>{item.name}</strong> - {item.color}, Size: {item.size} <strong>&nbsp;ID:{item.productId}</strong><br />
                  {item.quantity} x {item.price.toLocaleString()} đ = {item.totalPrice.toLocaleString()} đ
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"} {/* Thay đổi nội dung button khi đang lưu */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
