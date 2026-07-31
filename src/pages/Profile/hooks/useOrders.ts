import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/api/client";

export interface Order {
  id: number | string;
  total: number;
  status: string;
  created_at: string;

}

const ORDERS_QUERY_KEY = ["my-orders"];

export function useOrders() {
  const { data: orders, isLoading, isError, error } = useQuery<Order[], Error>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async () => {
      const response: any = await orderApi.getMyOrders();

      return response.data?.orders || response.data || response;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    orders: orders || [],
    isLoading,
    isError,
    error,
  };
}