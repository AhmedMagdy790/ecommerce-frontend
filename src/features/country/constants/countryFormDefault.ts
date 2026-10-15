// src/features/countries/constants/countryFormDefault.ts

import type { CountryFormData } from "../model/schema/countrySchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const countryDefaultValues: CountryFormData = {
    name: getEmptyTranslatedObject(), // اسم الدولة متعدد اللغات (ar, en, etc.)
    code: "",                         // كود الدولة (مثل: EG, US)
    phone_code: "",                   // مفتاح الاتصال الدولي (مثل: 20, 1)
    is_active: true,                  // الحالة الافتراضية نشطة
};