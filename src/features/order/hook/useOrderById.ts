// src/features/order/hook/useOrderById.ts

import { useQuery } from "@tanstack/react-query";
import type { Order } from "../types";
import { orderApi } from "@/api/client";

export const useOrderById = (id: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrderById<Order>(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 دقائق
  });


  return { 
    order: data?.data || data, // التوافق مع بنية استجابة الـ API سواء كانت مغلفة بـ data أو مباشرة
    isLoading, 
    error: error ? (error as any)?.response?.data?.message || "Failed to load order data" : null 
  };
};