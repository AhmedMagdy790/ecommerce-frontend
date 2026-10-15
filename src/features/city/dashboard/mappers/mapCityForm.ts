// src/features/cities/mappers/mapCityForm.ts
import type { TranslatedText } from "@/shared/types/types";
import type { CityFormData } from "../../model/schema/citySchema";
import type { City } from "../../model/types/city.types";
import { defaultValues } from "../constants/cityFormDefault";

export function mapCityToForm(
    city?: City<TranslatedText> | null
): CityFormData {
    if (!city) {
        return defaultValues;
    }

    return {
        ...defaultValues,
        name: city.name ?? defaultValues.name,
        country_id: city.country_id ?? city.country?.id ?? null,
        city_code: city.city_code ?? null,
        is_active: city.is_active ?? true,
    };
}