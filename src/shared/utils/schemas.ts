import { z } from "zod";
import type { TranslatedText } from "../types/types";
import { useLanguageStore } from "@/features/language/store/useLanguageStore";

export function createTranslatedSchema(
  isRequired?: true,
  customMessage?: string
): z.ZodType<TranslatedText>;

export function createTranslatedSchema(
  isRequired: false,
  customMessage?: string
): z.ZodType<TranslatedText | null | undefined>;

export function createTranslatedSchema(
  isRequired: boolean = true,
  customMessage?: string
): z.ZodType<TranslatedText> | z.ZodType<TranslatedText | null | undefined> {

  const { activeLanguages, languages } = useLanguageStore.getState();
  
  // استخراج الـ code الخاص باللغة الافتراضية من قائمة اللغات الأساسية
  const defaultLangCode = languages.find((l) => l.isDefault)?.code || "ar";

  const shape: Record<string, z.ZodTypeAny> = {};

  activeLanguages.forEach((lang) => {
    const isDefault = lang.code === defaultLangCode;

    if (isDefault && isRequired) {
      const message =
        customMessage ?? `هذا الحقل مطلوب (${lang.nativeName || lang.code})`;

      shape[lang.code] = z.string({ message }).trim().min(1, message);
    } else {
      shape[lang.code] = z
        .string()
        .nullable()
        .optional()
        .transform((val) => val ?? "");
    }
  });

  const baseSchema = z.object(shape) as unknown as z.ZodType<TranslatedText>;

  return isRequired ? baseSchema : baseSchema.nullable().optional();
}