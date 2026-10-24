// src/features/payment/constants/paymentGatewayFormDefault.ts

import type { PaymentGatewayFormData } from "../model/schema/paymentGatewaySchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const paymentGatewayDefaultValues: PaymentGatewayFormData = {
    name: getEmptyTranslatedObject(),
    description: getEmptyTranslatedObject(),
    slug: "",
    type: "",                                
    credentials: {},                         
    is_active: true,
    is_test_mode: false,
    icon_name: "",
    extra_fees: 0,
    logo: null,

    supported_currencies: [],
    min_amount: null,
    max_amount: null,
    allows_digital: true,
    allows_physical: true,
    country_ids: [],
};