import { create } from "zustand";
import type { ICartItem } from "../types/cart.types";
import cartService from "../../services/cartService";

interface AddToCartPayload {
  product_variant_id: number | string;
  quantity: number;
}

interface CartState {
  items: ICartItem[];
  isLoading: boolean;
  isOpen: boolean;

  // Helpers / Computed
  getTotalItems: () => number;
  getSubtotal: () => number;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  updateQuantity: (cartItemId: number | string, variantId: number | string, newQuantity: number) => Promise<void>;
  removeFromCart: (id: number | string) => Promise<void>;
  clearCart: () => Promise<void>;

  // UI State Actions
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  isOpen: false,

  // 1. حساب مجموع قطع السلة
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + (item.quantity || 0), 0);
  },

  // 2. حساب إجمالي السعر مع دعم مرن للأسعار والأنواع المختلفة
  getSubtotal: () => {
    return get().items.reduce((sum, item) => {
      if (item.total_price !== undefined && item.total_price !== null) {
        return sum + Number(item.total_price);
      }
      if (item.item_total !== undefined && item.item_total !== null) {
        return sum + Number(item.item_total);
      }
      
      const price = item.variant?.price ?? item.product?.price ?? 0;
      return sum + Number(price) * (item.quantity || 1);
    }, 0);
  },

  // جلب عناصر السلة
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const items = await cartService.getCartItems();
      set({ items, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch cart items", error);
      set({ isLoading: false });
    }
  },

  // إضافة منتج للسلة
  addToCart: async (payload: AddToCartPayload) => {
    set({ isLoading: true });
    try {
      await cartService.addToCart(payload);
      await get().fetchCart();
      set({ isOpen: true, isLoading: false });
    } catch (error) {
      console.error("Failed to add item to cart", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // 3. تحديث الكمية باستخدام التحديث المتفائل (Optimistic Update السريع)
  updateQuantity: async (cartItemId: number | string, variantId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await get().removeFromCart(cartItemId);
      return;
    }

    const previousItems = get().items;

    // تحديث الشاشة فوراً دون انتظار السيرفر
    set({
      items: previousItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      ),
    });

    try {
      // يفضل استخدام updateQuantity في الـ service إن وجد، أو استخدام payload الإضافة حسب السيرفر
      await cartService.addToCart({
        product_variant_id: variantId,
        quantity: newQuantity,
      });

      // مزامنة صامتة في الخلفية مع السيرفر لضمان القيمة
      const updatedItems = await cartService.getCartItems();
      set({ items: updatedItems });
    } catch (error) {
      console.error("Failed to update item quantity", error);
      set({ items: previousItems }); // Rollback في حال فشل الطلب
    }
  },

  // حذف عنصر من السلة بأسلوب متفائل
  removeFromCart: async (id: number | string) => {
    const previousItems = get().items;

    set({
      items: previousItems.filter((item) => item.id !== id),
    });

    try {
      await cartService.removeFromCart(id);
    } catch (error) {
      console.error("Failed to remove cart item", error);
      set({ items: previousItems });
    }
  },

  // تفريغ السلة بالكامل
  clearCart: async () => {
    const previousItems = get().items;
    set({ items: [] });

    try {
      await cartService.clearCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
      set({ items: previousItems });
    }
  },

  // التحكم بفتح وإغلاق القائمة الجانبية للسلة
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));