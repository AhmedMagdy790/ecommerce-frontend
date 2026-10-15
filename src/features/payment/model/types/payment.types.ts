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
  created_at: string;
  updated_at: string;

  // العلاقات (Relations)
  media?: Media;
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