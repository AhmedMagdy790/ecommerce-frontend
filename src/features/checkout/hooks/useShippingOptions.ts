// src/pages/Checkout/hooks/useShippingOptions.ts

import { useQuery } from "@tanstack/react-query";
import type { ShippingOption } from "../types/checkout";
import { storeApi } from "@/api/client";

export function useShippingOptions(cityId?: number | string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shipping-options", cityId],
    queryFn: async () => {
      if (!cityId) return [];
      const response = await storeApi.getCityShippingOptions(cityId);
      
      // Handle Laravel resource wrapper: response.data.rsg, response.rsg, response.data.data, or response.data
      const rawData = response?.data ?? response;
      const optionsArray = rawData?.rsg || rawData?.data?.rsg || rawData?.data || rawData;

      return Array.isArray(optionsArray) ? optionsArray : [];
    },
    enabled: !!cityId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });


  // Map the API response completely, mapping shipping_rate_id as id and passing through all fields
  const options: ShippingOption[] = (data || []).map((item: any) => ({
    id: item.shipping_rate_id ?? item.id,
    shipping_rate_id: item.shipping_rate_id,
    code: item.code,
    name: item.name,
    description: item.description,
    phone: item.phone,
    email: item.email,
    logo: item.logo,
    logo_url: item.logo_url,
    supports_cod: item.supports_cod,
    is_active: item.is_active,
    courier: item.courier,
    rates: item.rates,
    shipping_details: item.shipping_details,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));

  return {
    options,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}