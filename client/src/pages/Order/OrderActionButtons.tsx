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
    <button className="btn btn-primary btn-lg" onClick={onClick}>
      Theo dõi đơn hàng
    </button>
  );
};

export const ViewLocationButton: React.FC<ButtonProps> = ({ onClick }) => (
  <button className="btn btn-info btn-lg" onClick={onClick}>
    Xem vị trí
  </button>
);

export const ReorderButton: React.FC<ButtonProps> = ({ onClick }) => (
  <button className="btn btn-success btn-lg" onClick={onClick}>
    Mua lại
  </button>
);
