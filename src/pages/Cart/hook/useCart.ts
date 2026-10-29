// src/features/cart/hook/useCart.ts

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import type { ICartItem } from "@/features/cart/model/types/cart.types";
import cartService from "@/features/cart/services/cartService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore()

  // Fetch cart items
  const {
    data: cartItems = [],
    isLoading,
    isError,
    error,
  } = useQuery<ICartItem[]>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCartItems(),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, 
  });

  // Calculate total count of items taking quantity into account
  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // Add item mutation with Optimistic Update
  const addToCartMutation = useMutation({
    mutationFn: (data: { product_variant_id: number | string; quantity: number }) =>
      cartService.addToCart(data),
    
    // التحديث الفوري قبل أن يرد السيرفر
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<ICartItem[]>(CART_QUERY_KEY);

      // تحديث مؤقت في الكاش المحلي لكي يظهر المنتج فوراً
      queryClient.setQueryData<ICartItem[]>(CART_QUERY_KEY, (old = []) => {
        const existingIndex = old.findIndex(
          (item) => item.variant?.id === newItem.product_variant_id || item.id === newItem.product_variant_id
        );

        if (existingIndex > -1) {
          // تحديث الكمية إذا كان المنتج موجوداً
          const updated = [...old];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newItem.quantity,
          };
          return updated;
        }

        // إبقاء القديم لحين جلب البيانات الحقيقية من السيرفر
        return old;
      });

      return { previousCart };
    },
    onError: (_err, _newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // Remove item mutation with Optimistic Update
  const removeFromCartMutation = useMutation({
    mutationFn: (id: string | number) => cartService.removeFromCart(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<ICartItem[]>(CART_QUERY_KEY);

      // حذف العنصر محلياً وفوراً من الواجهة
      queryClient.setQueryData<ICartItem[]>(CART_QUERY_KEY, (old = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousCart };
    },
    onError: (_err, _id, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<ICartItem[]>(CART_QUERY_KEY);

      queryClient.setQueryData<ICartItem[]>(CART_QUERY_KEY, []);

      return { previousCart };
    },
    onError: (_err, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  return {
    cartItems,
    totalItems,
    isLoading,
    isError,
    error,
    
    addToCart: addToCartMutation.mutateAsync,
    isAdding: addToCartMutation.isPending,
    
    removeFromCart: removeFromCartMutation.mutateAsync,
    isRemoving: removeFromCartMutation.isPending,
    
    clearCart: clearCartMutation.mutateAsync,
    isClearing: clearCartMutation.isPending,
  };
}