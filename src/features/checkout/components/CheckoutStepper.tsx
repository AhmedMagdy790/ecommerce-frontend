// src/pages/Checkout/CheckoutStepper.tsx

import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function CheckoutStepper({ currentStep, onStepClick }: CheckoutStepperProps) {
  const { t } = useTranslation("checkout");

  const steps = [
    { number: 1, title: t("stepper.contact", "Contact") },
    { number: 2, title: t("stepper.address", "Address") },
    { number: 3, title: t("stepper.shipping", "Shipping") },
    { number: 4, title: t("stepper.payment", "Payment") },
    { number: 5, title: t("stepper.review", "Review") },
  ];

  return (
    <nav aria-label="Checkout Progress" className="py-4">
      <ol className="flex items-center justify-between w-full max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = step.number < currentStep;

          return (
            <li key={step.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center group relative">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.number)}
                  className={`
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-full
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
                    ${
                      isCompleted
                        ? "bg-[var(--color-primary)] text-white cursor-pointer hover:opacity-90"
                        : isCurrent
                        ? "border-2 border-[var(--color-primary)] bg-[var(--color-background)] text-[var(--color-primary)] shadow-sm"
                        : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-not-allowed"
                    }
                  `}
                >
                  {isCompleted ? <Check size={18} strokeWidth={2.5} /> : step.number}
                </button>

                <span
                  className={`
                    absolute
                    top-12
                    text-xs
                    font-medium
                    whitespace-nowrap
                    transition-colors
                    ${
                      isCurrent
                        ? "text-[var(--color-primary)] font-semibold"
                        : isCompleted
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-secondary)]"
                    }
                  `}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1
                    h-0.5
                    mx-4
                    transition-colors
                    duration-200
                    ${
                      currentStep > step.number
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-border)]"
                    }
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}