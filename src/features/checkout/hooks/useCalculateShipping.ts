// useCalculateShipping.ts

import { useMutation } from "@tanstack/react-query";
import { shippingService } from "@/services/shippingService";

export function useCalculateShipping() {
  return useMutation({
    mutationFn: shippingService.calculateShipping,
  });
}