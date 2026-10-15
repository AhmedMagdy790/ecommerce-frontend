import type { TFunction } from "i18next";

export const getLanguageOptions = (t: TFunction) => [
  {
    label: t("modal.basic.lang_ar", "العربية (AR)"),
    value: "ar",
  },
  {
    label: t("modal.basic.lang_en", "English (EN)"),
    value: "en",
  },
];