// src/features/countries/components/CountryModal.tsx

import { useRef, useMemo } from "react";
import { Controller, type Path } from "react-hook-form";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";

import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import type { Country } from "@/features/country/model/types/country.types";
import { useCountryForm } from "@/features/country/hooks/useCountryForm";
import type { CountryFormInput } from "@/features/country/model/schema/countrySchema";
import { ActionButtons } from "@/shared/components/ActionButtons";

interface ICountryModal extends IModal {
  country?: Country<TranslatedText> | null;
}

export default function CountryModal({ isOpen, closeModal, country }: ICountryModal) {
  const { t } = useTranslation();

  const { currentLangCode, getCurrentLangName } = useLanguageStore();

  const currentLangName = getCurrentLangName();

  const formRef = useRef<HTMLFormElement>(null);

  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useCountryForm(country, closeModal, isOpen);

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
      `${field}.${lang}` as Path<CountryFormInput>
    );
  };

  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "Active")}`, value: true },
    { label: `🔴 ${t("status.inactive", "Inactive")}`, value: false },
  ], [t]);


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
      />}
      title={
        isEditMode
          ? t("countries.editCountry", "Edit Country")
          : t("countries.addNewCountry", "Add New Country")
      }
      description={t("countries.modalDescription", "Enter country details to manage shipping and regions")}
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
              "بيانات الدولة الأساسية"
            )}
            hasLanguageError={hasLanguageError}
          />

          <Input
            key={`name-${currentLangCode}`}
            label={`${t("countries.countryName", "Country Name")} (${currentLangName})`}
            placeholder={t("countries.namePlaceholder", "e.g. Egypt")}
            error={getTranslatedError(errors.name, currentLangCode)}
            icon={<Globe size={16} />}
            {...registerTranslatedField("name", currentLangCode)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("countries.code", "Country Code (ISO)")}
              placeholder="e.g. EG"
              error={errors.code?.message}
              {...register("code")}
            />

            <Input
              label={t("countries.phoneCode", "Phone Code")}
              placeholder="e.g. 20"
              error={errors.phone_code?.message}
              {...register("phone_code")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("countries.currency", "Currency")}
              placeholder="EYG"
              error={errors.currency?.message}
              {...register("currency")}
            />

            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label={t("common.status", "Status")}
                    disabled={isSubmitting}
                    placeholder={t("common.selectStatus", "Select Status...")}
                    options={statusOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.is_active?.message}
                  />
                )}
              />
            </div>
          </div>

        </div>
      </form>
    </BaseModel>
  );
}