import type { City } from "@/features/city/model/types/city.types";
import type { TranslatedText } from "@/shared/types/types";

export interface Country<TText = TranslatedText | string> {
  id: number;
  name: TText;
  code: string;
  currency: string;
  phone_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;


  cities?: City<TText>[];
}

export interface CountryFormData {
  name: TranslatedText;
  code: string;
  phone_code: string;
  is_active?: boolean;
}

export interface CountryFilters {
  search?: string;
  name?: string;
  code?: string;
  phone_code?: string;
  is_active?: boolean | '';
  [key: string]: any;
}

export interface CountryStats {
  total: number;
  active: number;
  inactive: number;
  trashed: number;
}