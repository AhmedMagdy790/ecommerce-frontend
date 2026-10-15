import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { IWishlistItem } from "../types";



export const wishlistService = {
  /**
   * جلب جميع عناصر قائمة الرغبات (المفضلة)
   */
  getWishlist: async (): Promise<IWishlistItem[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.wishlist.list);
    // حسب هيكلة الـ Backend لديك، قد تكون البيانات داخل response.data أو response.data.data
    return response.data?.data || response.data || [];
  },

  /**
   * إضافة منتج إلى قائمة الرغبات
   */
  addToWishlist: async (productId: string | number): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.wishlist.add, {
      product_id: productId, // أو product_variant_id حسب تصميم السيرفر
    });
    return response.data;
  },

  /**
   * حذف منتج من قائمة الرغبات
   */
  removeFromWishlist: async (productId: string | number): Promise<any> => {
    // بناءً على ما إذا كان الـ Endpoint يتطلب الـ ID في الرابط أو في الـ Body
    const response = await axiosInstance.delete(
      API_ENDPOINTS.wishlist.destroy(productId)
    );
    return response.data;
  },
};

export default wishlistService;