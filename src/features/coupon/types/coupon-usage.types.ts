import type { User } from "@/features/users/model/types/user.types";
import type { Coupon } from "./coupon.types";
import type { Order } from "@/features/order/model/types/order.types";


export interface CouponUserUsage {
  id: number;
  coupon_id: number;
  user_id: number;
  order_id: number;
  used_at: string;

  // العلاقات (Relations)
  coupon?: Coupon;
  user?: User;
  order?: Order;
}

export interface CouponUserUsageFormData {
  coupon_id: number;
  user_id: number;
  order_id: number;
  used_at?: string;
}

export interface CouponUserPivot {
  id: number;
  coupon_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;

  // العلاقات
  coupon?: Coupon;
  user?: User;
}