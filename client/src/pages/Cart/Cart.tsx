import { useState, useEffect } from 'react';
import './cart.css'
import CartItem from "./CartItem";

export default function Cart() {
    const [cartItems, setCartItems] = useState<any[]>([]);

    useEffect(() => {
        // Items fakes
        const generateRandomId = () => Math.random().toString(36).substr(2, 9);
        const fakeCartItems = [
            {
            id: generateRandomId(),
            name: 'Product 1',
            price: 100000,
            quantity: 1,
            image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477613/item/vngoods_01_477613_3x4.jpg?width=369'
            },
            {
            id: generateRandomId(),
            name: 'Product 1',
            price: 100000,
            quantity: 1,
            image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477613/item/vngoods_01_477613_3x4.jpg?width=369'
            },
            {
            id: generateRandomId(),
            name: 'Product 1',
            price: 100000,
            quantity: 1,
            image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477613/item/vngoods_01_477613_3x4.jpg?width=369'
            },
            {
            id: generateRandomId(),
            name: 'Product 1',
            price: 100000,
            quantity: 1,
            image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477613/item/vngoods_01_477613_3x4.jpg?width=369'
            },
            {
            id: generateRandomId(),
            name: 'Product 1',
            price: 100000,
            quantity: 1,
            image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477613/item/vngoods_01_477613_3x4.jpg?width=369'
            },
            {
            id: generateRandomId(),
            name: 'Product 1',
            price: 100000,
            quantity: 1,
            image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477613/item/vngoods_01_477613_3x4.jpg?width=369'
            },
            {
            id: generateRandomId(),
            name: 'Product 1',
            price: 100000,
            quantity: 1,
            image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477613/item/vngoods_01_477613_3x4.jpg?width=369'
            }
        ];
        setCartItems(fakeCartItems);
    }, []);

    const handleRemove = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString();
    };

    return (
        <div className="cart-full-container w-100 h-100 d-flex justify-content-center align-items-center">
            <div className='cart-container h-100 mt-3'>
                <div className="cart-list-container d-flex flex-column justify-content-start align-items-center">
                    <h1 className="list-label align-self-start">{"giỏ hàng".toUpperCase()}</h1>
                    {
                        cartItems.length === 0 ? (
                            <div className="empty-cart align-self-start">
                                <span>Giỏ hàng của bạn đang trống</span>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <CartItem 
                                    key={item.id} 
                                    item={item} 
                                    handleRemove={handleRemove} 
                                    handleUpdateQuantity={handleUpdateQuantity} 
                                />
                            ))
                        )
                    }  
                </div>
                {   cartItems.length > 0 &&
                    <div className="cart-action d-flex flex-column align-items-start mt-3 border-top-3">
                        <div className="cart-action-left d-flex justify-content-start align-items-center">
                            <h2>Tổng cộng:&nbsp;<strong>{calculateTotal()} VND</strong>
                            </h2>
                        </div>    
                        <div className="cart-action-right">
                            <button className="btn btn-danger">Thanh toán</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}