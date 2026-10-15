// src/features/shipping/constants/shippingRateFormDefault.ts

import type { ShippingRateFormData } from "../../model/schema/shippingRateSchema";

export const shippingRateDefaultValues: ShippingRateFormData = {
    city_id: 0,                 // معرف المدينة الافتراضي
    shipping_courier_id: 0,     // معرف شركة الشحن الافتراضي
    shipping_fee: 0,            // رسوم الشحن الأساسية
    estimated_delivery_from: 1, // الحد الأدنى لأيام التوصيل المتوقعة
    estimated_delivery_to: 3,   // الحد الأقصى لأيام التوصيل المتوقعة
    cod_fee: 0,                 // رسوم الدفع عند الاستلام
    base_cost: 0,               // التكلفة الأساسية للشحن
    base_weight: 1,             // الوزن الأساسي المشمول (كجم)
    extra_per_kg: 0,            // رسوم الوزن الإضافي لكل كيلوجرام
    max_weight: null,           // الحد الأقصى للوزن المقبول (اختياري)
    free_shipping_threshold: null, // الحد الأدنى لتفعيل الشحن المجاني (اختياري)
    is_active: true,            // الحالة الافتراضية نشطة
};