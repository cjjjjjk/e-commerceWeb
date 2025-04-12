import axios from "axios";

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
    createProduct: async (data: any) => {
      return api.post("/products", data);
    },
  
    createCategory: async (data: any) => {
      return api.post("/categories", data);
    },
  
  };
  
export default adminService;