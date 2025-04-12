import React from 'react';
import PropTypes from 'prop-types';
import './CartItem.css';

type CartItemProps = {
    item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    };
    handleRemove: (id: string) => void;
    handleUpdateQuantity: (id: string, quantity: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ item, handleRemove, handleUpdateQuantity }) => {
    return (
        <div className="cart-item w-100 d-flex align-items-start gap-3">
            <img 
            src={item.image} 
            alt={item.name} 
            className="cart-item-image" 
            />
            <div className="item-details">
            <h4>{item.name}</h4>
            <p>Price: {item.price.toLocaleString()} VND</p>
            <p>Quantity: {item.quantity}</p>
            </div>
            <div className="item-actions d-flex gap-2 ms-auto">
            <button className="quantity-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
            <button className="quantity-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
            <button className="remove-btn btn btn-danger" onClick={() => handleRemove(item.id)}>Xóa</button>
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