import { FormProvider } from "react-hook-form";
import BaseModal from "@/shared/components/BaseModal";
import { Button } from "@/shared/components/Button";
// import { StepperIndicator } from "../components/StepperIndicator";

import BasicInfoStep from "./steps/BasicInfoStep";
import VariantsStep from "./steps/VariantsStep";
import MediaStep from "./steps/MediaStep";

import { useProductForm } from "../hooks/useProductForm";
import { useCategoryStore } from "@/features/dashboard/category/store/useCategoryStore";
import { useEffect } from "react";
import { StepperIndicator } from "../../products/components/StepperIndicator";
import type { ProductFormData } from "../../products/schema/productSchema";



type Props = {
  isOpen: boolean;
  closeModal: () => void;
  product?: Partial<ProductFormData> & { id?: number };
};

export default function BaseModalProduct({ isOpen, closeModal, product }: Props) {
  
const { methods, currentStep, nextStep, prevStep, onSubmit, isLastStep } = 
    useProductForm(product, closeModal, isOpen);

  const { fetchAdminCategories } = useCategoryStore();

  useEffect(() => {
    fetchAdminCategories();
  }, []);



  return (
    <BaseModal 
      isOpen={isOpen} 
      closeModal={closeModal} 
      title={product ? "تعديل المنتج" : "إضافة منتج جديد"}
      maxWidth="max-w-4xl"
    >
      <StepperIndicator currentStep={currentStep} steps={["البيانات", "المتغيرات", "الوسائط"]} />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-[500px]">

          <div className="flex-grow py-6">
            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <VariantsStep />}
            {currentStep === 3 && <MediaStep isUpdate={!!product} />}
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                السابق
              </Button>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  methods.reset();
                  closeModal();
                }}
              >
                إلغاء
              </Button>
              {!isLastStep ? (
                <Button type="button" onClick={nextStep}>
                  المتابعة
                </Button>
              ) : (
                <Button type="submit" isLoading={methods.formState.isSubmitting}>
                  {product ? "حفظ التعديلات" : "إتمام الإضافة"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
}