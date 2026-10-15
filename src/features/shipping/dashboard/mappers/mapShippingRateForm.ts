// src/features/shipping/mappers/mapShippingRateForm.ts

import type { ShippingRateFormData } from "../../model/schema/shippingRateSchema";
import type { ShippingRate } from "../../model/types/rate.types";
import { shippingRateDefaultValues } from "../constants/shippingRateFormDefault";
import type { TranslatedText } from "@/shared/types/types";

export function mapShippingRateToForm(
    rate?: ShippingRate<TranslatedText> | null
): ShippingRateFormData {

    if (!rate) {
        return shippingRateDefaultValues;
    }

    return {
        ...shippingRateDefaultValues,
        city_id: rate.city_id ?? shippingRateDefaultValues.city_id,

        shipping_courier_id: rate.shipping_courier_id ?? shippingRateDefaultValues.shipping_courier_id,
        
        // قراءة الرسوم من كائن fees المتداخل
        shipping_fee: rate.fees?.shipping_fee ?? shippingRateDefaultValues.shipping_fee,
        cod_fee: rate.fees?.cod_fee ?? shippingRateDefaultValues.cod_fee,
        base_cost: rate.fees?.base_cost ?? shippingRateDefaultValues.base_cost,
        extra_per_kg: rate.fees?.extra_per_kg ?? shippingRateDefaultValues.extra_per_kg,

        // قراءة أوقات التوصيل من كائن delivery_time المتداخل
        estimated_delivery_from: rate.delivery_time?.from ?? shippingRateDefaultValues.estimated_delivery_from,
        estimated_delivery_to: rate.delivery_time?.to ?? shippingRateDefaultValues.estimated_delivery_to,

        // قراءة الإعدادات من كائن settings المتداخل
        base_weight: rate.settings?.base_weight ?? shippingRateDefaultValues.base_weight,
        max_weight: rate.settings?.max_weight ?? shippingRateDefaultValues.max_weight,
        free_shipping_threshold: rate.settings?.free_shipping_threshold ?? shippingRateDefaultValues.free_shipping_threshold,
        is_active: rate.settings?.is_active ?? shippingRateDefaultValues.is_active,
    };
}