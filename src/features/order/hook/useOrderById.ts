// src/features/order/hook/useOrderById.ts

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/api/client";
import type { Order } from "../model/types/order.types";

type OrderByIdResponse = {
  data: {
    order: Order<string>;
  };
};

export const useOrderById = (id: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrderById<OrderByIdResponse>(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Navigate through: response -> data -> order
  const order = data?.data?.order;

  return { 
    order,
    isLoading, 
    error: error ? (error as any)?.response?.data?.message || "Failed to load order data" : null 
  };
};