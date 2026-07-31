import type { ICountry } from "../country/types";
import type { IShippingCourier } from "../couriers/types/types";

export interface ICity {
  id: number;
  country_id: string | number;
  name: { ar: string; en: string };
  city_code?: string;
  is_active: boolean;
  country?: ICountry;
}

export interface CityState {
  cities: ICity[];
  shippingOptions: IShippingCourier[];
  loading: boolean;
  searchQuery: string;
  fetchCities: (country_id: number) => Promise<void>;
  fetchShippingMethods: (city_id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleCityStatus: (id: number) => Promise<void>;
  createCity: (data: any) => Promise<void>;
  updateCity: (id: string, data: any) => Promise<void>;
  deleteCity: (id: number) => Promise<void>;
  addShippingRate: (cityId: number, data: any) => Promise<any>;
  getFilteredCities: () => ICity[];
}