import React from "react";

interface ButtonProps {
  onClick?: () => void;
}

export const CancelOrderButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className="btn btn-danger btn-lg" onClick={onClick}>
      Huỷ đơn
    </button>
  );
};

export const TrackOrderButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button className="btn btn-outline-primary btn-lg" disabled onClick={onClick}>
      Đơn hàng đã được đóng gói
    </button>
  );
};

export const ViewLocationButton: React.FC<ButtonProps> = ({ onClick }) => (
  <button className="btn btn-outline-info btn-lg" onClick={onClick} disabled>
    Đơn hàng đang được vận chuyển đến bạn
  </button>
);

export const ReorderButton: React.FC<ButtonProps> = ({ onClick }) => (
  <button className="btn btn-success btn-lg" onClick={onClick}>
    Mua lại
  </button>
);
