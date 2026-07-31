import { type CartItem } from "../types/cart";
import axiosInstance from "@/api/axios-instance"; 
import { API_ENDPOINTS } from "@/api/endpoints";

export const getCart = async (): Promise<CartItem[]> => {
  const { data: response } = await axiosInstance.get(API_ENDPOINTS.cart.list);
  // تأكد من المسار بناءً على الـ Response الفعلي من السيرفر (غالباً response.data)
  return response.data; 
};

export const addToCartApi = async (item: { product_id: number; quantity: number }) => {
  const { data: response } = await axiosInstance.post(API_ENDPOINTS.cart.add, item);
  return response.data;
};

export const updateCartApi = async (id: number | string, quantity: number) => {
  // لاحظ أنك في Route List لديك PUT|PATCH على api/v1/cart/{id}
  const { data: response } = await axiosInstance.patch(`/cart/${id}`, { quantity });
  return response.data;
};

export const deleteCartApi = async (id: number | string) => {
  const { data: response } = await axiosInstance.delete(API_ENDPOINTS.cart.remove(id));
  return response.data;
};