import { useState } from "react";
import type { UseFormTrigger } from "react-hook-form";

import { useCheckoutValidation } from "./useCheckoutValidation";
import type { CheckoutFormValues } from "../types/checkout";

export function useCheckoutStep(
  trigger: UseFormTrigger<CheckoutFormValues>,
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