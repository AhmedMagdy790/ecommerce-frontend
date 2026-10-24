// src/features/countries/constants/countryFormDefault.ts

import type { CountryFormData } from "../model/schema/countrySchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const countryDefaultValues: CountryFormData = {
    name: getEmptyTranslatedObject(),
    code: "",
    currency: "",
    phone_code: "",
    is_active: true,
};