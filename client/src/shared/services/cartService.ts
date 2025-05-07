import axios from "axios";

const CART_KEY = process.env.REACT_APP_CART_KEY || "guess_cart";

// Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.data?.message === 'jwt expired' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/users/refresh-token');

        const newToken = res.data.token;

        localStorage.setItem('token', newToken);
        window.location.reload();

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('token');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

export interface CartItem {
  _id?: string,
  productId: string,
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

// ========== LOCAL CART METHODS ==========

function getLocalCart(): CartItem[] {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveLocalCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ========== EXPORT METHODS ==========

export async function getCart(): Promise<any> {
  if (isLoggedIn()) {
    const res = await api.get("/carts/");
    return res.data;
  } else {
    return getLocalCart();
  }
}

export async function addToCart(item: CartItem): Promise<void> {
  if (isLoggedIn()) {
    const {id,...cartItem} = item;
    await api.patch("/carts/addItem", {...cartItem,productId: id });
  } else {
    const cart = getLocalCart();
    const existingItem = cart.find(
      (p) => p.id === item.id && p.size === item.size && p.color === item.color
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    saveLocalCart(cart);
  }
}

export async function removeFromCart(item: CartItem): Promise<void> {
  if (isLoggedIn()) {
    await api.patch("/carts/deleteItem", item);
  } else {
    const updatedCart = getLocalCart().filter(
      (p) => !(p.id === item.id && p.size === item.size && p.color === item.color)
    );
    saveLocalCart(updatedCart);
  }
}

export async function updateQuantity(item: CartItem): Promise<void> {
  console.log(item)
  if (isLoggedIn()) {
    await api.patch("/carts/updateItem", {...item, id: item._id});
  } else {
    const cart = getLocalCart();
    const targetItem = cart.find(
      (p) => p.id === item.id && p.size === item.size && p.color === item.color
    );
    if (targetItem) {
      targetItem.quantity = item.quantity;
      saveLocalCart(cart);
    }
  }
}

