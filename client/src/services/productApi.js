import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/products",
  headers: {
    "Content-Type": "application/json",
  },
});


export const createProduct = async (productData) => {

    const response = await api.post("/", productData);
    return response.data;
  }

export const getProducts = async () => {
    const response = await api.get("/");
    return response.data;
  }

export const getProduct = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  }

export const updateProduct = async (id, productData) => {
    const response = await api.put(`/${id}`, productData);
    return response.data;
  }

  export const deleteProduct = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  }