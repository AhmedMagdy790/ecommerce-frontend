// src/pages/Checkout/adapters/checkoutAdapter.ts

import type { CartItem } from "@/features/dashboard/cart/types/cart";
import type { CheckoutFormValues } from "../types/checkout";

export function mapCheckoutPayload(
    data: CheckoutFormValues,
    cartItems: CartItem[]
) {
    const mappedItems = cartItems?.map(item => ({
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
    })) ?? [];

    return {
        ...data,
        items: mappedItems,
    };
}