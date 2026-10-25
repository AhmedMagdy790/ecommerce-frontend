// src/features/cart/model/store/cart.store.ts

import { create } from "zustand";
import type { ICartItem } from "../types/cart.types";
import cartService from "../../services/cartService";

interface CartState {
  items: ICartItem[];
  isLoading: boolean;
  isOpen: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (payload: { product_variant_id: number | string; quantity: number }) => Promise<void>;
  updateQuantity: (cartItemId: number | string, variantId: number | string, newQuantity: number) => Promise<void>;
  removeFromCart: (id: number | string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Computed helpers
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  isOpen: false,

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + (item.quantity || 0), 0);
  },

  fetchCart: async () => {
    try {
      const items = await cartService.getCartItems();
      set({ items });
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  },

  addToCart: async (payload) => {
    set({ isLoading: true });
    try {
      await cartService.addToCart(payload);
      // جلب السلة مباشرة بعد الإضافة لتحديث العداد في الأزرار والنافبار
      const items = await cartService.getCartItems();
      set({ items, isLoading: false, isOpen: true });
    } catch (error) {
      console.error("Failed to add to cart", error);
      set({ isLoading: false });
    }
  },

  updateQuantity: async (cartItemId, variantId, newQuantity) => {
    try {
      // تحديث محلي فوري (Optimistic Update) لتجربة مستخدم سريعة
      set((state) => ({
        items: state.items.map((i) => (i.id === cartItemId ? { ...i, quantity: newQuantity } : i)),
      }));

      await cartService.addToCart({ product_variant_id: variantId, quantity: newQuantity });
      
      // مزامنة نهائية مع السيرفر
      const items = await cartService.getCartItems();
      set({ items });
    } catch (error) {
      console.error("Failed to update quantity", error);
      await get().fetchCart(); // استرجاع الحالة الصحيحة في حال حدوث خطأ
    }
  },

  removeFromCart: async (id) => {
    try {
      set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      }));

      await cartService.removeFromCart(id);
      const items = await cartService.getCartItems();
      set({ items });
    } catch (error) {
      console.error("Failed to remove item", error);
      await get().fetchCart();
    }
  },

  clearCart: async () => {
    set({ items: [] });
    try {
      await cartService.clearCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
      await get().fetchCart();
    }
  },
}));