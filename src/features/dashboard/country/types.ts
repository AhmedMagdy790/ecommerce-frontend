import type { IPagination, ResponseDataPaginat } from "@/shared/types/pagination";
import type { CountryFormData } from "./schema/countrySchema";

export interface ICountry {
    id: number;
    name: {
      ar: string;
      en: string;
    };
    code: string;
    phone_code: string;
    is_active: boolean;
}


export interface IPaginatedResponse<T> {
    status: boolean;
    message: string;
    data: ResponseDataPaginat<T>;
}

export interface CountryState {
  countries: ICountry[];
  pagination: IPagination | null;
  loading: boolean;
  searchQuery: string;
  
  // Actions 
  fetchCountriesForAdmin: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleCountryStatus: (id: number) => Promise<void>;
  createCountry: (data: CountryFormData) => Promise<void>;
  updateCountry: (id: string, data: CountryFormData) => Promise<void>;
  deleteCountry: (id: number) => Promise<void>;
  
  // Computed
  getFilteredCountries: () => ICountry[];
}