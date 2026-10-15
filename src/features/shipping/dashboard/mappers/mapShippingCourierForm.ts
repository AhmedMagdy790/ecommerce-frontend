// src/features/shipping/dashboard/mappers/mapShippingCourierForm.ts

import type { ShippingCourierFormData } from "../../model/schema/shippingCourierSchema";
import { shippingCourierDefaultValues } from "../constants/shippingCourierFormDefault";
import type { ShippingCourier } from "../../model/types/shipping.types";
import type { TranslatedText } from "@/shared/types/types";

export function mapShippingCourierToForm(
    courier?: ShippingCourier<TranslatedText> | null
): ShippingCourierFormData {

    if (!courier) {
        return shippingCourierDefaultValues;
    }

    return {
        ...shippingCourierDefaultValues,
        name: courier.name ?? shippingCourierDefaultValues.name,
        code: courier.code ?? shippingCourierDefaultValues.code,
        phone: courier.phone ?? shippingCourierDefaultValues.phone,
        email: courier.email ?? shippingCourierDefaultValues.email,
        api_endpoint: courier.api_endpoint ?? shippingCourierDefaultValues.api_endpoint,
        api_key: courier.api_key ?? shippingCourierDefaultValues.api_key,
        description: courier.description ?? shippingCourierDefaultValues.description,
        supports_cod: courier.supports_cod ?? shippingCourierDefaultValues.supports_cod,
        tracking_url: courier.tracking_url ?? shippingCourierDefaultValues.tracking_url,
        is_active: courier.is_active ?? shippingCourierDefaultValues.is_active,
        driver: courier.driver ?? shippingCourierDefaultValues.driver,
        logo: courier.logo ?? shippingCourierDefaultValues.logo,
    };
}