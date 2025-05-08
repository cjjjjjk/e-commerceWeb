import React, { useState, useEffect } from "react";
import "./orderModal.css"

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

export const getStatusMeta = (status: string): { label: string, style: string, icon: string } => {
    switch (status) {
        case "pending":
            return { label: "Chờ xác nhận", style: "btn-outline-secondary", icon: "pi pi-pencil" };
        case "confirmed":
            return { label: "Đã xác nhận", style: "btn-outline-primary", icon: "pi pi-pencil"};
        case "shipped":
            return { label: "Đang giao hàng", style: "btn-outline-warning" ,icon: "pi pi-pencil"};
        case "delivered":
            return { label: "Đã giao", style: "btn-outline-success" , icon: "pi pi-check-square"};
        case "cancelled":
            return { label: "Đã hủy", style: "btn-outline-danger" , icon: "pi pi-times-circle"};
        default:
            return { label: "Không rõ", style: "btn-outline-dark" , icon: "pi pi-pencil"};
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
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-lg mt-xl-5">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Chi tiết đơn hàng</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Tên khách hàng</label>
              <input type="text" className="form-control" value={order.shippingAddress.name} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Điện thoại</label>
              <input type="text" className="form-control" value={order.shippingAddress.phone} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Địa chỉ nhận hàng</label>
              <textarea className="form-control" rows={2} value={order.shippingAddress.address} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Ngày tạo</label>
              <input type="text" className="form-control" value={new Date(order.createdAt).toLocaleString()} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">Tổng tiền</label>
              <input type="text" className="form-control" value={`${order.totalPrice.toLocaleString()} đ`} disabled />
            </div>

            <div className="mb-2 row align-items-center">
              <label className="col-auto col-form-label">
                <strong>
                {"cập nhật trạng thái đơn hàng:".toUpperCase()}
                </strong>
              </label>
              <div className="col-auto">
                <span className={`btn ${getStatusMeta(targetStatus).style} px-3 py-2`}>
                  <i className={getStatusMeta(targetStatus).icon + " fw-bolder"}></i>
                </span>
              </div>
              <div className="col-auto">
                <select
                  className="form-select form-select-sm"
                  style={{ minWidth: 160 }}
                  value={targetStatus}
                  onChange={(e) =>
                    onStatusChange(e.target.value as "pending" | "confirmed" | "shipped" | "delivered" | "cancelled")
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {getStatusMeta(status).label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr />
            <h6>Sản phẩm:</h6>
            <ul className="list-group order-list-group">
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
