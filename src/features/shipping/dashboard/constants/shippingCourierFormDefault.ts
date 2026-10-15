// src/features/shipping/constants/shippingCourierFormDefault.ts

import type { ShippingCourierFormData } from "../../model/schema/shippingCourierSchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const shippingCourierDefaultValues: ShippingCourierFormData = {
    name: getEmptyTranslatedObject(),          // اسم شركة الشحن متعدد اللغات
    code: "",                                  // كود الشركة (مثل: DHL, ARAMEX)
    phone: "",                                 // رقم الهاتف
    email: "",                                 // البريد الإلكتروني
    api_endpoint: "",                          // رابط الـ API الخاص بالشركة
    api_key: "",                               // مفتاح الربط
    description: getEmptyTranslatedObject(),   // الوصف متعدد اللغات (اختياري)
    supports_cod: true,                        // دعم الدفع عند الاستلام افتراضياً
    tracking_url: "",                          // رابط تتبع الشحنات
    is_active: true,                           // الحالة الافتراضية نشطة
    driver: "",                                // السائق أو نظام التشغيل المرتبط
    logo: null,                                // الشعار (ملف أو رابط)
};