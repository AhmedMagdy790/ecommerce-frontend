// src/features/product/dashboard/components/modal/BaseProductModal.tsx
import { useTranslation } from "react-i18next";
import BaseModal from "@/shared/components/BaseModal";
import { Button } from "@/shared/components/Button";
import { StepperIndicator } from "./StepperIndicator";

import BasicInfoStep from "./steps/BasicInfoStep";
import VariantsStep from "./steps/VariantStep";
import MediaStep from "./steps/MediaStep";
import { FormProvider } from "react-hook-form";
import { useProductForm } from "@/features/product/dashboard/hook/useProductForm";
import { useMemo } from "react";
import { mapProductToForm } from "../../mappers/productForm.mapper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { checkLanguageError } from "@/shared/utils/helper";
import type { InitialProductData } from "@/features/product/model/types/productForm.types";
import { useLanguageStore } from "@/features/language/store/useLanguageStore";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  product?: InitialProductData | null;
};

export default function BaseProductModal({ isOpen, closeModal, product }: Props) {
  const { t } = useTranslation("product");
  
  const { currentLangCode } = useLanguageStore();

  // const currentLangName = getCurrentLangName();

  // Memoize the mapped initial form data safely
  const initialFormData = useMemo(
    () => (product ? mapProductToForm(product) : null),
    [product?.id]
  );

  const {
    methods,
    currentStep,
    nextStep,
    prevStep,
    onSubmit,
    isLastStep,
    isSubmitting,
    resetForm,
    formError,
    isEditMode,
  } = useProductForm(
    // The mapper returns the form shape; the hook accepts the persisted product shape.
    initialFormData as InitialProductData | null, // Pass the pre-mapped form data here
    closeModal,
    isOpen
  );

  const hasLanguageError = (lang: string) => {
    return checkLanguageError(methods.formState.errors, lang, ["name", "description"]);
  };

  const title = isEditMode 
    ? t("modal.edit_title", "تعديل المنتج") 
    : t("modal.create_title", "إضافة منتج جديد");

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  const stepsLabels = [
    t("modal.steps.basic", "البيانات"),
    t("modal.steps.variants", "المتغيرات"),
    t("modal.steps.media", "الوسائط"),
  ];

  const ActiveStepComponent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return BasicInfoStep;
      case 2:
        return VariantsStep;
      case 3:
        return MediaStep;
      default:
        return null;
    }
  }, [currentStep]);

  return (
    <BaseModal 
      isOpen={isOpen} 
      closeModal={handleClose} 
      title={title}
      maxWidth="max-w-4xl"
    >
      <LanguageOptions
        t={t}
        title={t(
          "modal.basic.section_title",
          "بيانات المنتج الأساسية"
        )}
        hasLanguageError={hasLanguageError}
      />

      <StepperIndicator currentStep={currentStep} steps={stepsLabels} />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-[500px]">
          <div className="flex-grow py-6">
            {(formError || methods.formState.errors.root?.server) && (
              <div className="mb-4 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)] flex items-center justify-between">
                <span>
                  {formError || methods.formState.errors.root?.server?.message}
                </span>
              </div>
            )}

            {ActiveStepComponent && (
              <ActiveStepComponent
                isUpdate={isEditMode}
                activeLang={currentLangCode}
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-[var(--color-border)]">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                {t("modal.actions.prev", "السابق")}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
              >
                {t("modal.actions.cancel", "إلغاء")}
              </Button>
              {!isLastStep ? (
                <Button type="button" onClick={nextStep}>
                  {t("modal.actions.next", "المتابعة")}
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting}>
                  {isEditMode ? t("modal.actions.save", "حفظ التعديلات") : t("modal.actions.submit", "إتمام الإضافة")}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
}