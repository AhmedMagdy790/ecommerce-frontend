// src/features/countries/mappers/mapCountryForm.ts

import type { CountryFormData } from "../../model/schema/countrySchema";
import { countryDefaultValues } from "../../constants/countryFormDefault";
import type { Country } from "../../model/types/country.types";
import type { TranslatedText } from "@/shared/types/types";

export function mapCountryToForm(
    country?: Country<TranslatedText> | null
): CountryFormData {

    if (!country) {
        return countryDefaultValues;
    }

    return {
        ...countryDefaultValues,
        name: country.name ?? countryDefaultValues.name,
        code: country.code ?? countryDefaultValues.code,
        // التحويل إلى String احتياطياً في حال كانت القادمة من الباك إند رقمية (Number)
        phone_code: country.phone_code ? String(country.phone_code) : countryDefaultValues.phone_code,
        is_active: country.is_active ?? countryDefaultValues.is_active,
    };
}