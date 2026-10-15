import { useRef, useMemo, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";
import { createTranslatedFieldRegistrar } from "@/shared/utils/formHelper";

import { useNavigationForm } from "../hook/useNavigationForm";
import type { NavMenu } from "../../model/types/navigation.types";
import { useNavigationStore } from "../../model/store/navigationStore";

interface INavigationModal extends IModal {
  menu?: NavMenu<TranslatedText> | null;
}

export default function NavigationModal({ isOpen, closeModal, menu }: INavigationModal) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language; // اللغة الحالية
  const { currentLangCode, getCurrentLangName } = useLanguageStore();
  const currentLangName = getCurrentLangName();

  const formRef = useRef<HTMLFormElement>(null);

  const locations = useNavigationStore((state) => state.locations);
  const isLoadingLocations = useNavigationStore((state) => state.isLoadingLocations);
  const fetchLocations = useNavigationStore((state) => state.fetchLocations);


  useEffect(() => {
    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen, fetchLocations]);


  const locationOptions = useMemo(() => {
    return locations.map((loc) => ({

      label: (loc.label as Record<string, string>)[currentLang] || (loc.label as Record<string, string>)['en'] || loc.value,
      value: loc.value,
    }));
  }, [locations, currentLang]);

  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useNavigationForm(menu, closeModal, isOpen);

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const registerTranslatedField = createTranslatedFieldRegistrar(register);

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
        />
      }
      title={
        isEditMode
          ? t("navigation.editMenu", "Edit Navigation Menu")
          : t("navigation.addNewMenu", "Add New Navigation Menu")
      }
      description={t("navigation.modalDescription", "Enter navigation menu details and select its location")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          {/* شريط تبديل اللغات */}
          <LanguageOptions
            t={t}
            title={t("modal.multilingual.section_title", "البيانات المترجمة")}
            hasLanguageError={hasLanguageError}
          />

          {/* حقل اسم القائمة المترجم حسب اللغة الحالية */}
          <Input
            key={`name-${currentLangCode}`}
            label={`${t("navigation.menuName", "Menu Name")} (${currentLangName})`}
            placeholder={t("navigation.namePlaceholder", "e.g. Main Header Menu")}
            error={getTranslatedError(errors.name, currentLangCode)}
            icon={<Menu size={16} />}
            {...registerTranslatedField("name", currentLangCode)}
          />

          {/* 🟢 استبدال حقل الـ Input القديم بـ CustomSelect مرتبط بالـ locations القادمة من الـ Store */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={t("navigation.locationKey", "Location Key (Identifier)")}
                disabled={isSubmitting || isLoadingLocations}
                placeholder={isLoadingLocations ? t("common.loading", "Loading...") : t("navigation.locationPlaceholder", "Select location...")}
                options={locationOptions}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.location?.message}
              />
            )}
          />

          {/* حقل الحالة */}
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={t("common.status", "Status")}
                disabled={isSubmitting}
                placeholder={t("common.selectStatus", "Select Status...")}
                options={statusOptions}
                value={field.value ?? true}
                onChange={field.onChange}
                error={errors.is_active?.message}
              />
            )}
          />
        </div>
      </form>
    </BaseModel>
  );
}