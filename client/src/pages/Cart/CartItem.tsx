import React from 'react';
import PropTypes from 'prop-types';
import './CartItem.css';
import { useNavigate } from 'react-router-dom';

type CartItemProps = {
    item: {
        _id?: string;
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
    handleUpdateQuantity: (id: string, quantity: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({ item, handleRemove, handleUpdateQuantity }) => {
    const navigate = useNavigate();
    return (
        <div className="cart-item w-100 d-flex align-items-start gap-3" >
            <img 
            src={item.image} 
            alt={item.name} 
            className="cart-item-image" 
            />
            <div className="item-details"
                onClick={()=>{
                    navigate(`/product/${item.productId ?? item.id}`)
                }}
            >
            <h4>{item.name}</h4>
            <p> 
                <button className='btn btn-danger' disabled>
                    <strong>{item.price.toLocaleString()} VND</strong>
                    </button>
            </p>
            <p>Số lượng: {item.quantity}</p>
            <p>Size: {item.size ?? "S"}</p>
             <p>Color: {item.color ?? "L"}</p>
            </div>
            <div className="item-actions d-flex gap-2 ms-auto">
            <button className="quantity-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
            <button className="quantity-btn" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
            <button className="remove-btn btn btn-danger" onClick={() => handleRemove(item)}>Xóa</button>
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