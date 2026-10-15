// src/features/product/dashboard/hooks/useProductStepper.ts
import { useState } from "react";
import type { UseFormTrigger } from "react-hook-form";
import type { ProductFormInput } from "../../model/schema/productSchema";


export const ProductStep = {
  BASIC: 1,
  VARIANTS: 2,
  MEDIA: 3,
} as const;

export type ProductStep = (typeof ProductStep)[keyof typeof ProductStep];

const TOTAL_STEPS = 3;

const STEP_FIELDS: Record<ProductStep, (keyof ProductFormInput)[]> = {
  [ProductStep.BASIC]: ["name", "category_id", "brand_id", "status"],
  [ProductStep.VARIANTS]: ["variants"],
  [ProductStep.MEDIA]: [],
};

export function useProductStepper(
  trigger: UseFormTrigger<ProductFormInput>
) {
  const [currentStep, setCurrentStep] = useState<ProductStep>(ProductStep.BASIC);

  const nextStep = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isValid = fieldsToValidate.length === 0 || (await trigger(fieldsToValidate));

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS) as ProductStep);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, ProductStep.BASIC) as ProductStep);
  };

  const resetStep = () => {
    setCurrentStep(ProductStep.BASIC);
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    resetStep,
    isLastStep: currentStep === TOTAL_STEPS,
  };
}