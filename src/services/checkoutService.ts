// src/services/checkoutService.ts

import { storeApi } from "@/api/client";
import type { CheckoutFormValues } from "@/features/checkout/types/checkout";


export const checkoutService = {
  /**
   * Place a new order with the complete checkout form data.
   */
  async placeOrder(data: CheckoutFormValues) {
    return await storeApi.submitCheckout(data);
  },

  /**
   * Apply a promo/coupon code during checkout.
   */
  async applyCoupon(code: string) {
    return await storeApi.applyCoupon({ code });
  },

  /**
   * Remove the applied coupon from checkout.
   */
  async removeCoupon() {
    return await storeApi.removeCoupon();
  },
};