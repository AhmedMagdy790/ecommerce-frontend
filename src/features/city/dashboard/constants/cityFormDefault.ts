// src/features/cities/constants/cityFormDefault.ts
import type { CityFormData } from "../../model/schema/citySchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const defaultValues: CityFormData = {
    name: getEmptyTranslatedObject(),
    country_id: "",
    is_active: true,
    city_code: "",
};
