// src/features/payment/constants/paymentGatewayFormDefault.ts

import type { PaymentGatewayFormData } from "../model/schema/paymentGatewaySchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const paymentGatewayDefaultValues: PaymentGatewayFormData = {
    name: getEmptyTranslatedObject(),          // اسم بوابة الدفع متعدد اللغات (مثل: Stripe, PayPal)
    description: getEmptyTranslatedObject(),   // وصف البوابة متعدد اللغات (اختياري)
    slug: "",                                  // المعرف الفريد للـ URL (مثل: stripe, paypal)
    type: "",                                  // نوع البوابة (مثل: credit_card, wallet)
    credentials: {},                           // بيانات الاعتماد (API Keys, Secrets) ككائن مرن
    extra_fees: 0,                             // الرسوم الإضافية الافتراضية
    is_active: true,                           // الحالة الافتراضية نشطة
    is_test_mode: false,                       // وضع الاختبار يبدأ مغلقاً افتراضياً (Live Mode)
    icon_name: "",                             // أيقونة البوابة المرئية إن وجدت
    logo: null,                                // ملف الشعار (File أو null)
};