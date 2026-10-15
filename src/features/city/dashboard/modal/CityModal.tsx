// src/features/cities/components/CityModal.tsx
import { useRef, useMemo } from "react";
import { Controller, type Path } from "react-hook-form";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";

// import type { City } from "../model/types/city.types";
import { useCityForm } from "../hook/useCityForm";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import type { City } from "../../model/types/city.types";
import { useCountryStore } from "@/features/country/model/store/useCountryStore";
import type { CityFormInput } from "../../model/schema/citySchema";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { ActionButtons } from "@/shared/components/ActionButtons";

interface ICityModal extends IModal {
  city?: City<TranslatedText> | null;
}

export default function CityModal({ isOpen, closeModal, city }: ICityModal) {
  const { t, i18n } = useTranslation();

  const currentAppLang = i18n.language;

  const { currentLangCode, getCurrentLangName } = useLanguageStore();

  const currentLangName = getCurrentLangName();
  const { items: countries } = useCountryStore();


  const formRef = useRef<HTMLFormElement>(null);


  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useCityForm(city, closeModal, isOpen);

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const registerTranslatedField = (
    field: "name",
    lang: string
  ) => {
    return register(
      `${field}.${lang}` as Path<CityFormInput>
    );
  };

  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "Active")}`, value: "true" },
    { label: `🔴 ${t("status.inactive", "Inactive")}`, value: "false" },
  ], [t]);

  const countryOptions = useMemo(() => {
    return (countries || []).map((country) => ({
      label: getLocalizedName(country.name, currentAppLang),
      value: String(country.id),
    }));
  }, [countries, currentAppLang]);

  const hasLanguageError = (lang: string) => {
    return checkLanguageError(methods.formState.errors, lang, ["name"]);
  };

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={closeModal}
      action={
        <ActionButtons
          closeModal={closeModal}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          formRef={formRef}
          t={t}
        />
      }
      title={
        isEditMode
          ? t("cities.editCity", "Edit City")
          : t("cities.addNewCity", "Add New City")
      }
      description={t("cities.modalDescription", "Enter city details to manage it in store")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
            <LanguageOptions
              t={t}
              title={t(
                "modal.basic.section_title",
                "بيانات المنتج الأساسية"
              )}
              hasLanguageError={hasLanguageError}
            />

          <Input
            key={`name-${currentLangCode}`}
            label={`${t("cities.cityName", "City Name")} (${currentLangName})`}
            placeholder={t("cities.namePlaceholder", "e.g. Cairo")}
            error={getTranslatedError(errors.name, currentLangCode)}
            icon={<Building2 size={16} />}
            {...registerTranslatedField("name", currentLangCode)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("common.status", "Status")}
                  disabled={isSubmitting}
                  placeholder={t("common.selectStatus", "Select Status...")}
                  options={statusOptions}
                  value={field.value !== undefined ? String(field.value) : "true"}
                  onChange={(val) => field.onChange(val === "true")}
                  error={errors.is_active?.message}
                />
              )}
            />

            <Controller
              name="country_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("cities.country", "Country")}
                  disabled={isSubmitting}
                  placeholder={t("cities.selectCountry", "Select Country...")}
                  options={countryOptions}
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ""}
                  onChange={(val) => {
                    if (val === "" || val == null) {
                      field.onChange(null);
                      return;
                    }
                    field.onChange(Number(val));
                  }}
                  error={errors.country_id?.message}
                />
              )}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}