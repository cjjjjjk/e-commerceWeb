import { useState, useEffect } from 'react';
import './cart.css';
import CartItem from "./CartItem";
import { getCart, removeFromCart, updateQuantity } from 'shared/services/cartService';
import { addToast } from 'shared/components/toast/toastSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import orderService from 'shared/services/orderService';
import userService from 'shared/services/auth/userService';
import { getStatusMeta } from 'pages/Admin/components/orderModal';
import { setIsTransference } from 'shared/header/headerSlice';

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [cartItems, setCartItems] = useState<any[]>([]);
    const [orderItem, setOrderItem] = useState<any>({});
    const [showModal, setShowModal] = useState(false);
    const [userData, setuserData] = useState<any>(null)
    const [name, setName]= useState<string>('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
        dispatch(addToast({ message, type, link }));
    };

    const [myOrders, setMyOrders] = useState<any[]>([]);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await orderService.getMyOrders();
                setMyOrders([...(orders.data.orders ?? [])].reverse());
            } catch (error) {
                console.error("Không thể tải đơn hàng:", error);
            }
        };
    
        if (userData) {
            fetchOrders();
        }
    }, [userData,cartItems]);

    useEffect(()=>{
        document.title = "E-COMMERCE | GIỎ HÀNG";
        dispatch(setIsTransference(false))
        const fetchUser = async() =>{
            try {
                const user = await userService.getMe();
                if(user) {
                    setAddress(user.data.data.user.address ?? "");
                    setPhone(user.data.data.user.phone ?? "")
                    setName(user.data.data.user.displayName?? "")
                    setuserData(user.data.data.user ?? {});
                }
            }
            catch (err){
            }
        }

        fetchUser();
    }, [])

    useEffect(() => {
        const fetchCart = async () => {
            try {
                setIsLoading(true);
                const cart = await getCart();
                const cartshow = Array.isArray(cart) ? cart : cart.items;
                if (cart) {
                    setCartItems(cartshow);
                    if (cart.items) setOrderItem(cart);
                } else {
                    setCartItems([]);
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Failed to load cart:", err);
                showToast("Không thể tải giỏ hàng", "error");
                setIsLoading(false);
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
            setIsLoading(true);
            await removeFromCart(item);
            const cart = await getCart();
            const cartshow = Array.isArray(cart) ? cart : cart.items;
            if (cart) {
                setCartItems(cartshow);
                showToast("Xóa sản phẩm thành công", "success");
                setIsLoading(false);
            } else {
                setCartItems([]);
            setIsLoading(false);
        }
    } catch (err) {
            setIsLoading(false);
            showToast("Lỗi khi xóa sản phẩm", "error");
        }
    };

    const handleUpdateQuantity = async (id: string |undefined, quantity: number) => {
        setIsLoading(true);
        const updated = cartItems.map(item =>
            item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        setCartItems(updated);

        const token = localStorage.getItem("token");
        if (token) {
            const target = updated.find(i => i._id === id);
            if (target) {
                try {
                    await updateQuantity(target);
                    showToast("Cập nhật thành công", "success")
                    setIsLoading(false);
            } catch (err) {
                showToast("Không thể cập nhật số lượng", "error");
                setIsLoading(false);
                }
            }
        }
        setIsLoading(false);
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
            setShowModal(true);
        }
    };

    const handleConfirmOrder = async () => {
        if (!address.trim() || !phone.trim()) {
            showToast("Vui lòng nhập đầy đủ địa chỉ và số điện thoại", "error");
            return;
        }

        try {
            const finalOrder = {
                ...orderItem,
                shippingAddress: {
                    name: name,
                    address: address.trim(),
                    phone:phone.trim()
                }
            };
            await userService.updateInfor({...userData,displayName:name, address, phone})
            await orderService.createOrder(finalOrder);
            showToast("Đặt hàng thành công!", "success");
            setShowModal(false);
            setCartItems([]);
        } catch (error:any) {
            showToast(`${error.response.data?.message??"Lỗi khi tạo đơn hàng"}`, "error");
        }
    };
    return (
        <div className="cart-full-container w-100 h-100 d-flex flex-column justify-content-center align-items-center mb-5">
            <div className='cart-container h-100 mt-3'>
            <div className="container cart-list-container">
                <span className="list-label text-start mb-3 ">{"giỏ hàng".toUpperCase()}</span>
                {Array.isArray(cartItems) && cartItems.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                    {cartItems.map((item) => (
                        <CartItem
                        item={item}
                        handleRemove={handleRemove}
                        handleUpdateQuantity={handleUpdateQuantity}
                        isLoading={isLoading} 
                        />
                    ))}
                    </div>
                ) : (
                    <div className="alert alert-info">Giỏ hàng của bạn đang trống</div>
                )}
                </div>
                {
                    cartItems.length > 0 &&
                    <div className="cart-action container d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 p-4 border-top">
                    <div className="cart-action-left text-center text-md-start mb-3 mb-md-0">
                        <h4 className="mb-0">
                        TỔNG THANH TOÁN:&nbsp;
                        <strong className="text-danger">{calculateTotal().toLocaleString()} VND</strong>
                        </h4>
                    </div>
                    <div className="cart-action-right text-center">
                        <button
                            className="btn btn-danger btn-lg px-4 fw-bold"
                            onClick={handleCheckout}
                            disabled={isLoading}
                        >
                        Thanh toán
                        </button>
                    </div>
                    </div>
                }
                <hr />
                {userData && (
                    <div className="cart-list-container d-flex flex-column justify-content-start align-items-center">
                    <div className='d-flex w-100 px-2 align-items-center mb-3'>
                        <span className="list-label text-start ">{"đơn hàng của bạn".toUpperCase()}</span>
                        <span className='btn btn-outline-dark ms-auto fw-bolder'
                            onClick={()=>{
                                navigate("/order")
                            }}
                        >
                        Xem Toàn BỘ <i className='pi pi-arrow-up-right'></i></span>
                    </div>
                    {userData && (
                        <div className="accordion w-100" id="ordersAccordion">
                            {Array.isArray(myOrders) && myOrders.length > 0 ? (
                            myOrders.map((order: any, index: number) => {
                                const statusMeta = getStatusMeta(order.status);
                                return (
                                <div className="accordion-item" key={order._id || index}>
                                    <h2 className="accordion-header" id={`heading-${index}`}>
                                    <button
                                        className="accordion-button collapsed d-flex justify-content-between gap-2 align-items-center"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${index}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse-${index}`}
                                    >
                                        <div className="me-1">
                                        <span className="fw-bold">Đơn hàng #{order._id}</span>
                                        <div className="small text-muted">
                                            Ngày: {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                        </div>
                                        <button
                                        type="button"
                                        className={`btn btn-sm fw-bolder text-nowrap ${statusMeta.style}`}
                                        disabled
                                        >
                                        {statusMeta.label}
                                        </button>
                                    </button>
                                    </h2>
                                    <div
                                    id={`collapse-${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading-${index}`}
                                    data-bs-parent="#ordersAccordion"
                                    >
                                    <div className="accordion-body bg-light">
                                        <div><strong>Địa chỉ:</strong> {order.shippingAddress?.address}</div>
                                        <div><strong>Điện thoại:</strong> {order.shippingAddress?.phone}</div>
                                        <div><strong>Tổng tiền:</strong> {order.totalPrice?.toLocaleString()} VND</div>
                                        <div className="mt-2">
                                        <strong>Sản phẩm:</strong>
                                        <ul className="ps-3">
                                            {order.items.map((item: any, idx: number) => (
                                            <li key={idx}>
                                                {item.name} - {item.quantity} x {item.price.toLocaleString()} VND
                                            </li>
                                            ))}
                                        </ul>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                );
                            })
                            ) : (
                            <div className="text-muted">Bạn chưa có đơn hàng nào</div>
                            )}
                        </div>
                        )}
                </div> )}
            </div>

            {showModal &&
            <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                    <h5 className="modal-title">Xác nhận đơn hàng</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                    </div>

                    <div className="modal-body">
                    <div className="mb-3">
                        <label className="form-label">Tên người nhận</label>
                        <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập họ tên"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Địa chỉ giao hàng</label>
                        <textarea
                        className="form-control"
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nhập địa chỉ cụ thể"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                        type="tel"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại liên hệ"
                        />
                    </div>

                    <div className="alert alert-light border d-flex justify-content-between align-items-center mt-4">
                        <strong className="fs-5">Tổng thanh toán:</strong>
                        <span className="fs-4 text-danger fw-bold">{calculateTotal()} VND</span>
                    </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-between">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </button>
                    <button type="button" className="btn btn-dark px-4 fw-bold" onClick={handleConfirmOrder}>
                        Xác nhận đặt hàng
                    </button>
                    </div>
                </div>
                </div>
            </div>
            }

            <div className='w-100 bg-dark'>
                <br /><br /><br />
                <span className='w-100 text-white'>AUTHOR: HAIHV(cjjjjjk) - cart-page</span>
            </div>
        </div>
    );
}
