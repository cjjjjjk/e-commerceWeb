import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

const token = localStorage.getItem("token");

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

const userService = {
  getMe: async () => {
    return api.get("/users/me");
  },
  logOut:async ()=>{
    return api.post("/users/logout");
  }
};

export default userService;
