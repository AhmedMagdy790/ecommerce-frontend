// src/shared/utils/shipping.ts

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
  shipping_rate_id?: number;
  shipping_method_id?: number;
  items: {
    product_variant_id: number;
    quantity: number;
  }[];
  payment_gateway_id?: string | number;
}

export interface MoneyAmount {
  amount: string;
  currency: string;
}

export interface ShippingCalculationBreakdown {
  base_fee: MoneyAmount;
  cod_fee: MoneyAmount;
  extra_weight_fee: MoneyAmount;
  payment_fee?: MoneyAmount;
  formula: string;
}

export interface ShippingDeliveryDays {
  from: number;
  to: number;
}

export interface ShippingCalculationResponse {
  allowed: boolean;
  actual_shipping_cost: MoneyAmount;
  customer_shipping_cost: MoneyAmount;
  customer_total_shipping_cost?: MoneyAmount;
  payment_fee?: MoneyAmount;
  is_free_shipping: boolean;
  base_fee: MoneyAmount;
  extra_fee?: MoneyAmount;
  breakdown?: ShippingCalculationBreakdown;
  delivery_days?: ShippingDeliveryDays;
}