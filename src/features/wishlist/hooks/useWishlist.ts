import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wishlistService from "@/features/wishlist/services/wishlistService"; // عدل المسار حسب مشروعك
import type { IWishlistItem } from "../types";


export const WISHLIST_QUERY_KEY = ["wishlist"];

export function useWishlist() {
  const queryClient = useQueryClient();

  // جلب عناصر المفضلة
  const {
    data: wishlistItems = [],
    isLoading,
    isError,
    error,
  } = useQuery<IWishlistItem[]>({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => wishlistService.getWishlist(),
  });

  // إضافة منتج للمفضلة
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string | number) => wishlistService.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  // حذف منتج من المفضلة
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string | number) => wishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  // نقل منتج من المفضلة إلى سلة التسوق مباشرة (ميزة احترافية رائعة)
  const moveToCartMutation = useMutation({
    mutationFn: async ({ productId, cartServiceFn }: { productId: string | number; cartServiceFn: any }) => {
      // 1. إضافته للسلة
      await cartServiceFn({ product_variant_id: productId, quantity: 1 });
      // 2. حذفه من المفضلة
      await wishlistService.removeFromWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // تحديث السلة أيضاً
    },
  });

  return {
    wishlistItems,
    totalWishlist: wishlistItems.length,
    isLoading,
    isError,
    error,
    addToWishlist: addToWishlistMutation.mutateAsync,
    isAdding: addToWishlistMutation.isPending,
    removeFromWishlist: removeFromWishlistMutation.mutateAsync,
    isRemoving: removeFromWishlistMutation.isPending,
    moveToCart: moveToCartMutation.mutateAsync,
    isMoving: moveToCartMutation.isPending,
  };
}