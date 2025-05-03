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

};
  
export default adminService;