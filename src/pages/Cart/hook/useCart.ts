// src/features/cart/hook/useCart.ts

import type { ICartItem } from "@/features/cart/model/types/cart.types";
import cartService from "@/features/cart/services/cartService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();

  // Fetch cart items
  const {
    data: cartItems = [],
    isLoading,
    isError,
    error,
  } = useQuery<ICartItem[]>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCartItems(),
  });

  // Calculate total count of items taking quantity into account
  const totalItems = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // Add item mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { product_variant_id: number; quantity: number }) =>
      cartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // Remove item mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (id: string | number) => cartService.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  return {
    cartItems,
    totalItems,
    isLoading,
    isError,
    error,
    
    // Add to cart
    addToCart: addToCartMutation.mutateAsync,
    isAdding: addToCartMutation.isPending,
    
    // Remove single item
    removeFromCart: removeFromCartMutation.mutateAsync,
    isRemoving: removeFromCartMutation.isPending,
    
    // Clear entire cart (تمت إضافتها هنا)
    clearCart: clearCartMutation.mutateAsync,
    isClearing: clearCartMutation.isPending,
  };
}