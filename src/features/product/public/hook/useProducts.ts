import { storeApi } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => storeApi.getProducts(params),
    staleTime: 1000 * 60 * 5,
  });
}