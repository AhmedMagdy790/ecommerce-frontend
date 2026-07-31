export interface PaymentGateway {
  id: number;
  name: Record<string, string> | string; // Translated JSON array from Laravel backend
  slug: string;
  type: string;
  logo: string | null;
  credentials: Record<string, any> | null;
  is_active: boolean;
  is_test_mode: boolean;
  description: Record<string, string> | string | null;
  extra_fees?: number;
}