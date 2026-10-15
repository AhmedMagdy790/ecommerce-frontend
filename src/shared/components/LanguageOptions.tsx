import { useMemo } from "react";
import { getLanguageOptions } from "../utils/languageOptions";
import type { TFunction } from "i18next";
import { Globe } from "lucide-react";
import CustomSelect, { type Option } from "./CustomSelect";
import { useLanguageStore } from "@/features/language/store/useLanguageStore";

type LanguageOptionsProps = {
  t: TFunction;
  title: string;
  hasLanguageError?: (lang: string) => boolean;
  // تم الاستغناء عن activeLang و setActiveLang لأنهما أصبحا في الـ Store!
};

export const LanguageOptions = ({
  t,
  title,
  hasLanguageError,
}: LanguageOptionsProps) => {
  // 1. جلب الحالة والدوال مباشرة من المتجر المركزي
  const currentLangCode = useLanguageStore((state) => state.currentLangCode);
  const setCurrentLangCode = useLanguageStore((state) => state.setCurrentLangCode);

  const languageOptions = useMemo(
    () => getLanguageOptions(t),
    [t]
  );

  const hasAnyError = useMemo(() => {
    if (!hasLanguageError) return false;
    return languageOptions.some((opt) => 
      hasLanguageError(String(opt.value))
    );
  }, [languageOptions, hasLanguageError]);

  const renderLanguage = (option: Option) => {
    const lang = String(option.value);
    const hasError = hasLanguageError?.(lang) ?? false;

    return (
      <div className="flex items-center gap-2">
        {hasError && (
          <span
            className="w-2 h-2 rounded-full bg-[var(--color-error)] shrink-0"
            title={t("validation.has_error", "يوجد خطأ")}
          />
        )}
        <span>{option.label}</span>
      </div>
    );
  };
  
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
        <Globe size={18} />
        <span>{title}</span>
      </div>

      <div className="w-40">
        <CustomSelect
          options={languageOptions}
          value={currentLangCode} // 👈 استخدام القيمة من الـ Store
          onChange={(val) => setCurrentLangCode(String(val))} // 👈 التحديث المباشر عبر الـ Store
          renderOption={renderLanguage}
          error={hasAnyError ? " " : undefined} 
        />
      </div>
    </div>
  );
};