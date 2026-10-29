// src/features/order/types/index.ts

import type { City } from "@/features/city/model/types/city.types";
import type { Coupon } from "@/features/coupon/types/coupon.types";
import type { GatewayPaymentStatus, PaymentAttempt } from "@/features/payment/model/types/payment.types";
import type { ShippingCourier } from "@/features/shipping/model/types/shipping.types";
import type { User } from "@/features/users/model/types/user.types";
import type { TranslatedText } from "@/shared/types/types";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'returned';
export type CustomerType = 'guest' | 'registered' | string;


export type OrderStatsData = {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  completed: number;
  cancelled: number;
  returned: number;
  trashed?: number;
};

export type OrderStatsProps = {
  stats: OrderStatsData;
};

export interface OrderItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
  total: number;
  name?: string | null;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  [key: string]: any;
}

export interface Order<TText = TranslatedText | string> {
  id: number;
  user_id: number | null;
  coupon_id: number | null;
  idempotency_key: string;
  
  order_number: string;
  status: OrderStatus;

  amounts: {
    sub_total: number | string;
    shipping_cost: number | string;
    discount_amount: number | string;
    total_amount: number | string;
    currency: string;
    is_shipping_free?: boolean;
  };

  // 🟢 الهيكل الجديد للدفع ومحاولاته التاريخية
  payment: {
    id?: number | null;
    status: GatewayPaymentStatus;
    method: string;
    attempts: PaymentAttempt[];
  };

  notes: string | null;
  cancel_reason: string | null;

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  customer?: {
    name: string | null;
    email: string | null;
    phone_primary: string;
    phone_secondary: string | null;
    type: string;
  } | null;

  shipping?: {
    address: string;
    address2?: string | null;
    courier_id: number;
    tracking_number: string | null;
    courier?: ShippingCourier<TText>;
  } | null;

  user?: User | null;
  city?: City<TText>;
  courier?: ShippingCourier;
  coupon?: Coupon | null;
  items?: OrderItem[];

  items_count?: number;

}

export interface OrderFormData {
  user_id?: number | null;
  coupon_id?: number | null;
  idempotency_key: string;
  customer_name?: string | null;
  phone_primary: string;
  phone_secondary?: string | null;
  customer_email?: string | null;
  customer_type?: CustomerType | null;
  shipping_address: string;
  shipping_address2?: string | null;
  city_id: number;
  shipping_courier_id: number;
  sub_total?: number;
  shipping_cost?: number;
  discount_amount?: number;
  total_amount?: number;
  payment_method: string;
  payment_id?: string | null;
  notes?: string | null;
  items: Array<{
    product_variant_id: number;
    quantity: number;
    price?: number;
    [key: string]: any;
  }>;
}

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | '' | 'trashed';
  payment_status?: GatewayPaymentStatus | '';
  payment_method?: string | '';
  city_id?: number | '';
  shipping_courier_id?: number | '';
  customer_type?: CustomerType | '';
  user_id?: number;
  [key: string]: any;
}