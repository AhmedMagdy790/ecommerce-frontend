import type { User } from "@/features/auth/types/auth.types";
import type { City } from "@/features/city/model/types/city.types";
import type { Country } from "@/features/country/model/types/country.types";

export type AddressType = 'home' | 'work' | string;

export interface Address {
  id: number | string;
  user_id: number;
  country_id: number;
  city_id: number;
  type: AddressType;
  street_details: string;
  area: string | null;
  building_number: string | null;
  phone_contact: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;

  // العلاقات (Relations)
  user?: User;
  country?: Country;
  city?: City;

  [key: string]: any;
}

export interface AddressFormData {
  user_id?: number;
  country_id: number;
  city_id: number;
  type?: AddressType;
  street_details: string;
  area?: string | null;
  building_number?: string | null;
  phone_contact?: string | null;
  is_default?: boolean;
}

export interface AddressFilters {
  user_id?: number;
  is_default?: boolean | '';
  type?: AddressType | '';
  [key: string]: any;
}