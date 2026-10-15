import type { Category } from "@/features/category/model/types/category.types";
import type { Product } from "@/features/product/model/types/product.types";

export interface CouponCategoryPivot {
  id: number;
  coupon_id: number;
  category_id: number;
}

// 2. تعريف الـ Pivot لجدول coupon_product
export interface CouponProductPivot {
  id: number;
  coupon_id: number;
  product_id: number;
  created_at?: string;
  updated_at?: string;
}

// 3. تحديث واجهة الكوبون (Coupon) لتدعم هذه العلاقات مع الـ Pivot الخاص بها
export interface CouponWithRelations {
  // ... (الخصائص الأساسية للكوبون)
  categories?: Array<Category & { pivot: CouponCategoryPivot }>;
  products?: Array<Product & { pivot: CouponProductPivot }>;
}

export type CouponScope = 'all' | 'categories' | 'products' | string;

export interface Coupon {
  id: number;
  code: string;
  description: string | null;
  type: string; // مثل fixed أو percentage
  value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  used_count: number;
  
  scope: CouponScope;
  first_order_only: boolean;
  free_shipping: boolean;
  user_usage_limit: number;
  
  currency: string | null;
  priority: number;
  is_active: boolean;
  is_stackable: boolean;

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  // العلاقات (Relations)
  user_usages?: CouponUserUsage[];
  categories?: Category[];
  products?: Product[];   // أو Product[]
}

export interface CouponUserUsage {
  id?: number;
  coupon_id: number;
  user_id: number;
  order_id: number;
  used_at: string;
  
  // العلاقات
  coupon?: Coupon;
}

export interface CouponFormData {
  code: string;
  description?: string | null;
  type: string;
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number | null;
  starts_at?: string | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  scope?: CouponScope;
  first_order_only?: boolean;
  free_shipping?: boolean;
  user_usage_limit?: number;
  currency?: string | null;
  priority?: number;
  is_active?: boolean;
  is_stackable?: boolean;
}

export interface CouponFilters {
  search?: string;
  code?: string;
  is_active?: boolean | '';
  scope?: CouponScope | '';
  [key: string]: any;
}