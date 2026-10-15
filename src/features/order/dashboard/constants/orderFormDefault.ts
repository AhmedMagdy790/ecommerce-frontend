// src/features/order/constants/orderFormDefault.ts
import { v4 as uuidv4 } from "uuid"; // أو استخدام crypto.randomUUID()
import type { OrderFormData } from "../../model/schema/orderSchema";

export const defaultOrderValues: OrderFormData = {
    user_id: null,
    customer_name: "",
    phone_primary: "",
    phone_secondary: null,
    customer_email: null,
    shipping_address: "",
    shipping_address2: null,
    city_id: 0,
    shipping_rate_id: 0,
    payment_gateway_id: 0,
    coupon_code: null,
    notes: null,
    idempotency_key: typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : uuidv4(),
    items: [],
};