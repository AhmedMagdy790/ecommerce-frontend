import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/api/client";
import type { Order } from "@/features/order/model/types/order.types";



export function useOrders(filters = {}) {
  const { data: orders, isLoading, isError, error } = useQuery<Order<string>[], Error>({
    queryKey: ["my-orders", filters], // إضافة الفلاتر هنا مفتاح أساسي لتحديث الكاش
    queryFn: async () => {
      const response = await orderApi.getMyOrders();
      return response.data?.items || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  return { orders: orders || [], isLoading, isError, error };
}