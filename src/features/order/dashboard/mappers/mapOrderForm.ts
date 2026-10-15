// src/features/order/mappers/mapOrderForm.ts

import type { OrderFormData } from "../../model/schema/orderSchema";
import type { Order } from "../../model/types/order.types";
import { defaultOrderValues } from "../constants/orderFormDefault";

export function mapOrderToForm(
    order?: Order | null
): OrderFormData {
    if (!order) {
        return defaultOrderValues;
    }

    return {
        ...defaultOrderValues,
        user_id: order.user_id ?? defaultOrderValues.user_id,
        customer_name: order.customer?.name ?? defaultOrderValues.customer_name,
        phone_primary: order.customer?.phone_primary ?? defaultOrderValues.phone_primary,
        phone_secondary: order.customer?.phone_secondary ?? defaultOrderValues.phone_secondary,
        customer_email: order.customer?.email ?? defaultOrderValues.customer_email,
        shipping_address: order.shipping?.address ?? defaultOrderValues.shipping_address,
        shipping_address2: order.shipping?.address2 ?? defaultOrderValues.shipping_address2,
        city_id: order.city?.id ?? defaultOrderValues.city_id,
        shipping_rate_id: defaultOrderValues.shipping_rate_id,
        coupon_code: order.coupon?.code ?? defaultOrderValues.coupon_code,
        notes: order.notes ?? defaultOrderValues.notes,
        idempotency_key: order.idempotency_key ?? defaultOrderValues.idempotency_key,
        items: order.items?.map((item) => ({
            product_variant_id: item.product_variant_id,
            quantity: item.quantity,
            price: item.price ?? 0,
        })) ?? defaultOrderValues.items,
    };
}