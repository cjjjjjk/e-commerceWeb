import { useState, useEffect } from 'react';
import './cart.css';
import CartItem from "./CartItem";
import { getCart, removeFromCart, updateQuantity } from 'shared/services/cartService';
import { addToast } from 'shared/components/toast/toastSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [cartItems, setCartItems] = useState<any[]>([]);

    const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
        dispatch(addToast({ message, type, link }));
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cart = await getCart();
                const cartshow = Array.isArray(cart) ? cart : cart.items;
                if (cart) {
                    setCartItems(cartshow);
                } else {
                    setCartItems([]);
                }
            } catch (err) {
                console.error("Failed to load cart:", err);
                showToast("Không thể tải giỏ hàng", "error");
            }
        };
    
        fetchCart();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token && cartItems.length > 0) {
            localStorage.setItem(process.env.REACT_APP_CART_KEY || "guess_cart", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const handleRemove = async (item: any) => {
        try {
            await removeFromCart(item);
            const cart = await getCart();
            const cartshow = Array.isArray(cart) ? cart : cart.items;
            if (cart) {
                setCartItems(cartshow);
            } else {
                setCartItems([]);
            }
        } catch (err) {
            showToast("Lỗi khi xóa sản phẩm", "error");
        }
    };

    const handleUpdateQuantity = async (id: string, quantity: number) => {
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );        
        setCartItems(updated);

        const token = localStorage.getItem("token");
        if (token) {
            const target = updated.find(i => i.id === id);
            if (target) {
                try {
                    await updateQuantity(target);
                } catch (err) {
                    showToast("Không thể cập nhật số lượng", "error");
                }
            }
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString();
    };

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Yêu cầu đăng nhập để thực hiện đặt hàng', "info");
            navigate('/signin');
        } else {
            // TODO: Điều hướng tới trang checkout khi đã có token
            navigate('/checkout');
        }
    };

    return (
        <div className="cart-full-container w-100 h-100 d-flex flex-column justify-content-center align-items-center mb-5">
            <div className='cart-container h-100 mt-3'>
                <div className="cart-list-container d-flex flex-column justify-content-start align-items-center">
                    <h1 className="list-label align-self-start">{"giỏ hàng".toUpperCase()}</h1>
                    {
                        Array.isArray(cartItems) && cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <CartItem
                                    key={`${item.id}-${item.size}-${item.color}`}
                                    item={item}
                                    handleRemove={handleRemove}
                                    handleUpdateQuantity={handleUpdateQuantity}
                                />
                            ))
                        ) : (
                            <div className="empty-cart align-self-start">
                                <span>Giỏ hàng của bạn đang trống</span>
                            </div>
                        )
                    }
                </div>
                {
                    cartItems.length > 0 &&
                    <div className="cart-action d-flex flex-column align-items-start mt-3 border-top-3 mb-5 py-5C">
                        <div className="cart-action-left d-flex justify-content-start align-items-center">
                            <h2>Tổng cộng:&nbsp;<strong>{calculateTotal()} VND</strong></h2>
                        </div>
                        <div className="cart-action-right">
                            <button className="btn btn-danger" onClick={handleCheckout}>
                                Thanh toán
                            </button>
                        </div>
                    </div>
                }
            </div>
            <div className='w-100 bg-dark'>
                <br /><br /><br />
                <span className='w-100 text-white'>AUTHOR: HAIHV(cjjjjjk) - cart-page</span>
            </div>
        </div>
    );
}
