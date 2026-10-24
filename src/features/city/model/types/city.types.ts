import type { Address } from "@/features/auth/types/auth.types";
import type { Country } from "@/features/country/model/types/country.types";
import type { ShippingCourier } from "@/features/shipping/model/types/shipping.types";
import type { TranslatedText } from "@/shared/types/types";

export interface City<TText = TranslatedText | string> {
  id: number;
  country_id: number;
  name: TText;
  city_code: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;

  // العلاقات (Relations)
  country?: Country;
  addresses?: Address[];
  couriers?: ShippingCourier[];
}

export interface CityFormData {
  country_id: number;
  name: TranslatedText;
  city_code?: string | null;
  is_active?: boolean;
}

export interface CityFilters {
  search?: string;
  name?: string;
  country_id?: number | '';
  is_active?: boolean | '';
  [key: string]: any;
}

export interface CityStats {
  total: number;
  active: number;
  inactive: number;
  [key: string]: number;
}