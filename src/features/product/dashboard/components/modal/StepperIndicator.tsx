// src/features/product/dashboard/components/modal/StepperIndicator.tsx
import React from "react";
import { CheckIcon } from "lucide-react";

type StepperIndicatorProps = {
  currentStep: number;
  steps: string[];
};

export const StepperIndicator: React.FC<StepperIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <nav aria-label="Progress" className="py-4 border-b border-[var(--color-border)]">
      <ol role="list" className="flex items-center justify-center gap-6 md:gap-12">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={step} className="flex items-center gap-3">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all
                  ${
                    isCompleted
                      ? "bg-[var(--color-success, #10b981)] text-white shadow-sm"
                      : isCurrent
                      ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20 shadow-sm"
                      : "bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4 stroke-[3]" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isCurrent
                    ? "text-[var(--color-text-primary)] font-bold"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};