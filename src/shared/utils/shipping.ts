export interface ShippingOption {
  id: number;
  city_id: number;
  courier_id: number;
  cost: number;
  estimated_days?: string;
  courier?: {
    id: number;
    name: Record<string, string> | string;
    logo?: string | null;
  };
}

export interface ShippingCalculationRequest {
  city_id: number;
  shipping_method_id: number;
  items: {
    product_variant_id: number;
    quantity: number;
  }[];
}

export interface ShippingCalculationResponse {
  shipping_cost: number;
  currency: string;
}