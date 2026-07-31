import productService from "@/features/product/services/productService";
import { useQuery } from "@tanstack/react-query";

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Product slug is required");
      return productService.getBySlug(slug);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}