import axios from "axios";
import type { Product, Order } from "../types";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface CreateOrderData {
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  order_items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export const productService = {
  getProducts: async (category?: string, sort?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getOrders: async (email: string): Promise<Order[]> => {
    const response = await api.get(`/orders?email=${encodeURIComponent(email)}`);
    return response.data;
  },
};
