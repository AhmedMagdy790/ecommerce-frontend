// src/features/payment/dashboard/mappers/mapPaymentGatewayForm.ts

import type { TranslatedText } from "@/shared/types/types";
import { paymentGatewayDefaultValues } from "../../constants/paymentGatewayFormDefault";
import type { PaymentGatewayFormData } from "../../model/schema/paymentGatewaySchema";
import type { PaymentGateway } from "../../model/types/payment.types";

export function mapPaymentGatewayToForm(
    gateway?: PaymentGateway<TranslatedText> | null
): PaymentGatewayFormData {

    if (!gateway) {
        return paymentGatewayDefaultValues;
    }

    return {
        ...paymentGatewayDefaultValues,
        name: gateway.name ?? paymentGatewayDefaultValues.name,
        description: gateway.description ?? paymentGatewayDefaultValues.description,
        slug: gateway.slug ?? paymentGatewayDefaultValues.slug,
        type: gateway.type ?? paymentGatewayDefaultValues.type,
        credentials: gateway.credentials ?? paymentGatewayDefaultValues.credentials,
        extra_fees: gateway.extra_fees ?? paymentGatewayDefaultValues.extra_fees,
        is_active: gateway.is_active ?? paymentGatewayDefaultValues.is_active,
        is_test_mode: gateway.is_test_mode ?? paymentGatewayDefaultValues.is_test_mode,
        icon_name: gateway.icon_name ?? paymentGatewayDefaultValues.icon_name,
        logo: gateway.logo ?? paymentGatewayDefaultValues.logo,
    };
}