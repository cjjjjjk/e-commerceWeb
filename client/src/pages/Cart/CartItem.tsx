import React from 'react';
import PropTypes from 'prop-types';
import './CartItem.css';
import { useNavigate } from 'react-router-dom';

type CartItemProps = {
    item: {
        _id?: string ;
        id: string;
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
        size: string;
        color: string;
    };
    handleRemove: (item: any) => void;
    handleUpdateQuantity: (id: string |undefined, quantity: number) => void;
    isLoading: boolean;
};

const CartItem: React.FC<CartItemProps> = ({ item, handleRemove, handleUpdateQuantity, isLoading }) => {
    const navigate = useNavigate();
    return (
        <div className="cart-item d-flex flex-row flex-md-row align-items-start gap-3 p-3 border rounded shadow-sm bg-white">
        <img
            src={item.image}
            alt={item.name}
            className="cart-item-image rounded"
        />

        <div
            className="item-details flex-grow-1"
            onClick={() => navigate(`/product/${item.productId ?? item.id}`)}
            style={{ cursor: 'pointer' }}
        >
            <h5 className="mb-1">{item.name}</h5>
            <div className="mb-2">
            <span className="badge bg-danger">{item.price.toLocaleString()} VND</span>
            </div>
            <div className="text-muted small">
            <div>Số lượng: {item.quantity}</div>
            <div>Size: {item.size ?? "S"}</div>
            <div>Color: {item.color ?? "L"}</div>
            </div>
        </div>

        <div className="h-100 item-actions d-flex flex-column flex-md-row justify-content-center align-items-center align-items-md-center gap-2 ms-md-auto">
            <div className='d-flex flex-row gap-1'>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} disabled={isLoading}>+</button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1 || isLoading}>-</button>
            </div>
            <button className="btn btn-danger btn-sm mt-auto" onClick={() => handleRemove(item)} disabled={isLoading}>Xóa</button>
        </div>
        </div>
    );
};

CartItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
    handleRemove: PropTypes.func.isRequired,
    handleUpdateQuantity: PropTypes.func.isRequired,
};

export default CartItem;