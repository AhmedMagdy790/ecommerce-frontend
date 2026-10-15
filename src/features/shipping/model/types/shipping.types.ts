import type { PaginationFilters } from "@/shared/types/pagination";
import type { TranslatedText } from "@/shared/types/types";

export interface ShippingRateDetails {
  id: number;
  city_id: number;
  shipping_courier_id: number;
  cost: string | number;
  cod_fee: string | number;
  delivery_days: number;
  delivery_time?: number;
  currency: string;
  free_shipping_threshold?: string | number | null;
  is_active: boolean;
}

export interface ShippingOption<TText = Record<string, string> | string> {
  id: number; // معرف الـ Rate الأساسي
  shipping_rate_id: number | null;
  code?: string | null;
  name: TText;
  description?: TText | null;
  logo?: string | null;
  logo_url?: string | null;
  phone?: string | null;
  email?: string | null;
  supports_cod?: boolean;
  is_active?: boolean;

  // تفاصيل التكلفة والمدة إما مباشرة أو داخل كائن rates
  cost?: string | number;
  cod_fee?: string | number;
  currency?: string;
  
  delivery?: {
    from: number;
    to?: number;
  };

  rates?: {
    id?: number | null;
    shipping_rate_id?: number | null;
    cost?: string | number;
    cod_fee?: string | number;
    delivery_days?: number;
    delivery_time?: number | null;
    currency?: string;
    final_price?: string | number;
  } | null;

  shipping_details?: any;
}


export interface ShippingCourier<TText = TranslatedText | string> {
  id: number;
  name: TText;
  logo?: string | null;
  logo_url?: string | null;
  code: string;
  phone?: string | null;
  email?: string | null;
  api_endpoint?: string | null;
  api_key?: string | null;
  description?: TText | null;
  supports_cod: boolean;
  tracking_url?: string | null;
  is_active: boolean;
  driver?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ShippingFilters extends PaginationFilters {
  name?: string;
  search?: string;
  email?: string;
  is_active?: boolean | string;
}

export interface ShippingStats {
  total: number;
  active: number;
  inactive: number;
  trashed?: number;
}

export type InitialShippingCourierData = {
  id: number;
  name: TranslatedText;
  code: string;
  phone?: string | null;
  email?: string | null;
  api_endpoint?: string | null;
  api_key?: string | null;
  description?: TranslatedText | null;
  supports_cod: boolean;
  tracking_url?: string | null;
  is_active: boolean;
  driver?: string | null;
  logo?: string | null;
  logo_url?: string | null;
};