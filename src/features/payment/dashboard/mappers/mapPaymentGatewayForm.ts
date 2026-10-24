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

        supported_currencies: gateway.supported_currencies ?? paymentGatewayDefaultValues.supported_currencies,
        min_amount: gateway.min_amount ?? paymentGatewayDefaultValues.min_amount,
        max_amount: gateway.max_amount ?? paymentGatewayDefaultValues.max_amount,
        allows_digital: gateway.allows_digital ?? paymentGatewayDefaultValues.allows_digital,
        allows_physical: gateway.allows_physical ?? paymentGatewayDefaultValues.allows_physical,
        country_ids: gateway.country_ids ?? paymentGatewayDefaultValues.country_ids,
    };
}