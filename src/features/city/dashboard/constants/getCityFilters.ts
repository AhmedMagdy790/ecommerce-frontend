// src/features/cities/constants/cityFilters.ts

import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
// import type { CityFilters } from "../model/types/city.types";
// import type { Country } from "@/features/countries/model/types/country.types"; // عدل المسار حسب مكان وجود Country لديك
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { Country } from "@/features/country/model/types/country.types";
import type { CityFilters } from "../../model/types/city.types";

export const getCityFilters = (
  t: TFunction,
  countries: Country[] = [],
  lang: string
): FilterField<CityFilters>[] => [
  {
    key: "is_active",
    label: t("filters.status", "الحالة"),
    type: "select",
    placeholder: t(
      "filters.status_placeholder",
      "تصفية حسب الحالة"
    ),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      {
        label: t("filters.active", "نشط"),
        value: "true",
      },
      {
        label: t("filters.inactive", "غير نشط"),
        value: "false",
      },
    ],
  },
  {
    key: "country_id",
    label: t("filters.country", "الدولة"),
    type: "select",
    placeholder: t(
      "filters.country_placeholder",
      "اختر الدولة"
    ),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      ...countries.map((country) => ({
        label: getLocalizedName(country.name, lang),
        value: String(country.id),
      })),
    ],
  },
];