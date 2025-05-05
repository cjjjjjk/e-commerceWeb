import axios from "axios";
import userService from "shared/services/auth/userService";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const token = localStorage.getItem("token")

api.interceptors.request.use(
  (config) => {
    if (token) {
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

const adminService = {
  checkAdmin: async ():Promise<boolean> => {
    const res = await userService.getMe();
    const userRole: string = res?.data?.data?.user.role ?? "user";
    return userRole === "admin";
  },

  createProduct: async (data: any) => {
    return api.post("/products", data);
  },

  createCategory: async (data: any) => {
    return api.post("/categories", data);
  },

  getAllOrder: async(req: {page: number, limit: number})=>{
    return api.get(`/orders?page=${req.page}&limit=${req.limit}`);
  },
  
  updateOrderStatus: async(orderId: string,status: "pending"|"confirmed"|"shipped"|"delivered"|"cancelled")=>{
    return api.patch(`/orders/${orderId}`, {status});
  },

  getRevenueStats(from: string, to: string) {
    return api.get(`/statistics/revenue`, {
      params: { from, to },
    });
  },
  
  getOrderStats(from: string, to: string) {
    return api.get(`/statistics/orders`, {
      params: { from, to },
    });
  },

  getMonthlyStats: async () => {
    return api.get("/statistics/monthly");
  },

  getBestSellers: async () => {
    return api.get("/statistics/best-sellers");
  },

  getMostStock: async () => {
    return api.get("/statistics/most-stock");
  },

  getMostReturned: async () => {
    return api.get("/statistics/most-returned");
  }
};
  
export default adminService;