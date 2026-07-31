import cartService from "@/features/cart/services/cartService";
import type { ICartItem } from "@/features/cart/types";
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
    mutationFn: (data: { product_variant_id: number | string; quantity?: number }) =>
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
  };
}