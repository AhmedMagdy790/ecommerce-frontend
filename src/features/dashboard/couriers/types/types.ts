import type { IPagination } from "@/shared/types/pagination";

// واجهة العدادات
export interface ICourierStats {
  total?: number;
  active?: number;
  trashed?: number;
}

// واجهة الرد الكلي
export interface ICourierResponse {
  items: IShippingCourier[];
  stats: ICourierStats;
}


export interface IShippingCourierState {
  items: IShippingCourier[];
  pagination: IPagination;
  trashedItems: IShippingCourier[];
  isLoading: boolean;
  toggleIsLoading: boolean;
  stats: ICourierStats;
  error: string | null;

  fetchShippingCouriers: () => Promise<void>;
  fetchTrashedShippingCouriers: () => Promise<void>;
  addShippingCourier: (payload: IShippingCourierPayload) => Promise<boolean>;
  updateShippingCourier: (id: number, payload: Partial<IShippingCourierPayload>) => Promise<boolean>;
  toggleShippingCourierStatus: (id: number) => Promise<void>;
  deleteShippingCourier: (id: number) => Promise<void>;
  restoreShippingCourier: (id: number) => Promise<void>;
  forceDeleteShippingCourier: (id: number) => Promise<void>;
}



export interface IShippingCityState {
  cities: IShippingCity[];
  isLoading: boolean;
  error: string | null;

  fetchCityDetails: (id: number) => Promise<void>;
  
  assignCity: (payload: Partial<IShippingCity>) => Promise<boolean>;
  
  updateCity: (id: number, payload: Partial<IShippingCity>) => Promise<boolean>;
  
  toggleCityStatus: (id: number) => Promise<void>;
  
  removeCity: (id: number) => Promise<void>;
}



export interface IShippingCourier {
  id: number;
  name: string | Record<string, string>;
  code: string;
  description: string;
  phone: string | null;
  email: string | null;
  api_endpoint: string | null;
  api_key: string | null;
  tracking_url: string | null;
  is_active: boolean;
  supports_cod: boolean;

  base_weight?: number;
  cod_fee?: number;
  shipping_fee?: number;
  extra_per_kg?: number;
  base_cost?: number;
  
  shipping_details?: {
    base_weight: number;
    cod_fee: number;
    delivery_days: number;
    extra_per_kg: number;
    is_active: boolean;
    shipping_fee: number;
  };

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface IShippingCourierPayload {
  name: string;
  code: string;

  phone?: string | null;
  email?: string | null;

  api_endpoint?: string | null;
  api_key?: string | null;

  tracking_url?: string | null;

  is_active: boolean;

  base_cost: number;

  supports_cod: boolean;
}



export interface IShippingRate {
  id: number;
  city: { id: number, name: string };
  courier: { id: number, name: string };
  fees: { base_cost: number, shipping_fee: number, cod_fee: number, extra_per_kg: number };
  settings: { base_weight: number, max_weight: number, free_shipping_threshold: number, is_active: boolean };
  delivery_time: { from: number, to: number };
}


export interface IShippingRateState {
  rates: IShippingRate[];
  allRatesForClient: IShippingRate[];
  pagination: IPagination;
  isLoading: boolean;
  error: string | null;

  fetchRatesAll: (filters?: any) => Promise<void>;
  handleFilter: (filters: any) => Promise<void>;
  toggleShippingRateStatus: (rateId: number) => Promise<void>;
  
  createRate: (
    cityId: number,
    payload: Partial<IShippingRate>
  ) => Promise<boolean>;

  setRate: (
    cityId: number,
    rateId: number,
    payload: Partial<IShippingRate>
  ) => Promise<boolean>;

  deleteRate: (rateId: number) => Promise<void>;
}



export interface IShippingCity {
  id: number;
  name: string; // الاسم الصحيح للـ Model
  is_active: boolean;
  // يمكننا إضافة علاقة الأسعار هنا إذا كان الـ API يرجعها
  shipping_rates?: IShippingRate[]; 
}