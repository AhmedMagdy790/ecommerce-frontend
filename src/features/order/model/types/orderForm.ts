import type { GatewayPaymentStatus } from "@/features/payment/model/types/payment.types";
import type { OrderItem, OrderStatus } from "./order.types";
import type { City } from "@/features/city/model/types/city.types";
import type { TranslatedText } from "@/shared/types/types";

export type PaymentStatus = 'paid' | 'unpaid' | 'failed' | 'refunded';

export type OrderCustomer = {
  name: string | null;
  phone_primary: string;
  phone_secondary: string | null;
  email?: string | null;
};

export type OrderAmounts = {
  sub_total: number | string;
  shipping_cost: number | string;
  discount_amount: number | string;
  total_amount: number | string;
  currency?: string;
};


export type InitialOrderData = {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: GatewayPaymentStatus;
  amounts: OrderAmounts;
  customer: OrderCustomer | null;
  city?: City<TranslatedText>;
  address?: string;
  notes: string | null;
  items?: OrderItem[];
};