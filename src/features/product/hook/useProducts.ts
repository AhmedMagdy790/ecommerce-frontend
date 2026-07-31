import { useQuery } from "@tanstack/react-query";
import productService from "../services/productService";

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getPublicProducts(params),
    staleTime: 1000 * 60 * 5,
  });
}