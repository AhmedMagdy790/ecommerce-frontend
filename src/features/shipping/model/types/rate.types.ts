// src/features/shipping/model/types/rate.types.ts

import type { PaginationFilters } from "@/shared/types/pagination";
import type { TranslatedText } from "@/shared/types/types";
import type { ShippingCourier } from "./shipping.types";

// الهيكل المتداخل لرسوم الشحن
export interface ShippingRateFees {
  shipping_fee: number;
  cod_fee: number;
  base_cost: number;
  extra_per_kg: number;
}

// الهيكل المتداخل لأيام التوصيل
export interface ShippingRateDeliveryTime {
  from: number;
  to: number;
}

// الهيكل المتداخل لإعدادات الشحن
export interface ShippingRateSettings {
  base_weight: number;
  max_weight: number | null;
  free_shipping_threshold?: number | null;
  is_active: boolean;
}

// هيكل المدينة المرتبطة بسعر الشحن
export interface ShippingRateCity<TText = TranslatedText | string> {
  id: number;
  country_id?: number;
  name: TText;
  country?: {
    id: number;
    code: string;
    name: TText;
    phone_code: string;
    is_active: boolean;
  };
}

export interface ShippingRate<TText = TranslatedText | string> {
  id: number;
  city_id: number;
  shipping_courier_id: number;
  currency?: string;
  
  // الكائنات المتداخله المتوافقة مع الـ API Resource
  city?: ShippingRateCity<TText>;
  courier?: ShippingCourier<TText>;
  fees: ShippingRateFees;
  delivery_time: ShippingRateDeliveryTime;
  settings: ShippingRateSettings;

  created_at?: string;
  updated_at?: string;
}

export interface ShippingRateFilters extends PaginationFilters {
  city_id?: number | string;
  shipping_courier_id?: number | string;
  is_active?: boolean | string;
}

export type InitialShippingRateData = {
  id?: number;
  city_id: number;
  shipping_courier_id: number;
  currency?: string;
  shipping_fee: number;
  estimated_delivery_from: number;
  estimated_delivery_to: number;
  cod_fee: number;
  base_cost: number;
  base_weight: number;
  extra_per_kg: number;
  max_weight: number;
  free_shipping_threshold?: number | null;
  is_active: boolean;
};


export interface ShippingRateStats {
  total: number;
  active: number;
  inactive: number;
}