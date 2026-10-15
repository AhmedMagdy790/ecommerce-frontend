// src/pages/Checkout/adapters/checkoutAdapter.ts

import type { CartItem } from "@/features/cart/model/types/cart.types";
import type { CheckoutFormValues } from "../types/checkout";

export function mapCheckoutPayload(
  data: Omit<CheckoutFormValues, "idempotency_key">,
  cartItems: CartItem[],
  idempotencyKey: string
) {
  return {
    idempotency_key: idempotencyKey,
    customer_name: data.customer_name,
    phone_primary: data.phone_primary,
    phone_secondary: data.phone_secondary,
    customer_email: data.customer_email,

    shipping_address: data.shipping_address,
    shipping_address2: data.shipping_address2,
    city_id: data.city_id,

    shipping_rate_id: data.shipping_rate_id,
    payment_gateway_id: data.payment_gateway_id,

    coupon_code: data.coupon_code,
    notes: data.notes,

    items: cartItems.map((item) => ({
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
    })),
  };
}