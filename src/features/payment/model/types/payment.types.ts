import type { Media } from "@/shared/types/media";
import type { TranslatedText } from "@/shared/types/types";

export interface PaymentGateway<TText = TranslatedText | string> {
  id: number;
  name: TText;
  slug: string;
  type: string;
  description: TText | null;
  credentials: Record<string, any> | null;
  is_active: boolean;
  is_test_mode: boolean;
  icon_name: string | null;
  extra_fees: number;
  logo: string | null;

  supported_currencies: string[];
  min_amount: number | null;
  max_amount: number | null;
  allows_digital: boolean;
  allows_physical: boolean;

  created_at: string;
  updated_at: string;

  country_ids: number[] | null;

  media?: Media;
  countries?: Array<{
    id: number;
    name: TText;
    code: string;
    currency: string;
  }>;
}

export interface PaymentAttempt {
    id: number;
    gateway: string;
    payment_gateway_id: number | null;
    amount: string;
    currency: string;
    status: 'pending' | 'success' | 'failed' | 'cancelled';
    failure_reason: string | null;
    created_at: string;
}

export type GatewayPaymentStatus = 'unpaid' | 'paid' | 'partially_refunded' | 'refunded';

export interface PaymentGatewayStats {
  total: number;
  active: number;
  inactive: number;
}

export interface PaymentGatewayFilters {
  search?: string;
  is_active?: boolean | '';
  is_test_mode?: boolean | '';
  [key: string]: any;
}