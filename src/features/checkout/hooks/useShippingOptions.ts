// src/pages/Checkout/hooks/useShippingOptions.ts

import { useQuery } from "@tanstack/react-query";
import { storeApi } from "@/api/client";
import type { ShippingOption } from "@/features/shipping/model/types/shipping.types";

export function useShippingOptions(cityId?: number | string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["shipping-options", cityId],
    queryFn: async () => {
      if (!cityId) return [];

      const response = await storeApi.optionsShipping({ 
        city_id: cityId 
      });
      
      const rawData = response?.data ?? response;
      const optionsArray = rawData?.shipping_options || rawData?.rsg || rawData?.data?.shipping_options || rawData?.data || rawData;

      return Array.isArray(optionsArray) ? optionsArray : [];
    },
    enabled: !!cityId,
    staleTime: 1000 * 60 * 5, 
  });

  const options: ShippingOption<string>[] = (data || []).map((item) => {
    // استخراج السعر والتكلفة بأمان من الجذر أو من كائن rates الداخلي
    const rateData = item.rates || {};
    const cost = item.cost ?? rateData.cost ?? "0.00";
    const currency = item.currency ?? rateData.currency ?? "EG";
    const deliveryDays = rateData.delivery_days ?? item.delivery?.from ?? 1;

    return {
      id: item.id,
      shipping_rate_id: item.shipping_rate_id ?? item.id ?? rateData.id,
      code: item.code,
      name: item.name ?? "Standard Shipping",
      description: item.description,
      logo: item.logo,
      logo_url: item.logo_url,
      phone: item.phone,
      email: item.email,
      supports_cod: item.supports_cod ?? false,
      is_active: item.is_active ?? true,
      cost: cost,
      cod_fee: item.cod_fee ?? rateData.cod_fee ?? "0.00",
      currency: currency,
      delivery: {
        from: deliveryDays,
        to: rateData.delivery_time ?? deliveryDays,
      },
      rates: rateData,
      shipping_details: item.shipping_details,
    };
  });

  return {
    options,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
}