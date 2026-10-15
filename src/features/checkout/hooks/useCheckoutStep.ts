// src/pages/Checkout/hooks/useCheckoutStep.ts

import { useState } from "react";
import type { FieldValues, UseFormTrigger } from "react-hook-form";

import { useCheckoutValidation } from "./useCheckoutValidation";

export function useCheckoutStep<TFieldValues extends FieldValues = FieldValues>(
  trigger: UseFormTrigger<TFieldValues>,
  initialStep = 1,
  maxSteps = 5
) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const { validateStep } = useCheckoutValidation(trigger);

  const next = async () => {
    const valid = await validateStep(currentStep);

    if (!valid) return false;

    setCurrentStep((prev) => Math.min(prev + 1, maxSteps));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return true;
  };

  const back = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const setStep = (step: number) => {
    if (step < 1 || step > maxSteps) return;

    setCurrentStep(step);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    currentStep,
    next,
    back,
    setStep,
  };
}