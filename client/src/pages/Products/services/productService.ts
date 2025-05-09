import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    withCredentials: true,
});

const productService = {
    getBestSellers: async () => {
            return api.get("/statistics/best-sellers");
    },
    getByCategoryId: async (categoryId: string) => {
        return (await api.get(`/products?categoryId=${categoryId}`));
    }
}
export default productService;
