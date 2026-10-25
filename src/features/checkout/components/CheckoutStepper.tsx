// src/pages/Checkout/CheckoutStepper.tsx

import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface CheckoutStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function CheckoutStepper({ currentStep, onStepClick }: CheckoutStepperProps) {
  const { t } = useTranslation("checkout");
  const { isRTL, lang } = useLang();

  const steps = [
    { number: 1, title: t("stepper.contact", { defaultValue: lang === "ar" ? "الاتصال" : "Contact" }) },
    { number: 2, title: t("stepper.address", { defaultValue: lang === "ar" ? "العنوان" : "Address" }) },
    { number: 3, title: t("stepper.shipping", { defaultValue: lang === "ar" ? "الشحن" : "Shipping" }) },
    { number: 4, title: t("stepper.payment", { defaultValue: lang === "ar" ? "الدفع" : "Payment" }) },
    { number: 5, title: t("stepper.review", { defaultValue: lang === "ar" ? "المراجعة" : "Review" }) },
  ];

  return (
    <nav dir={isRTL ? "rtl" : "ltr"} aria-label="Checkout Progress" className="py-6 px-4">
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
                    font-bold
                    transition-all
                    duration-[var(--duration-fast)]
                    ease-[var(--ease-default)]
                    ${
                      isCompleted
                        ? "bg-primary text-text-inverse cursor-pointer hover:opacity-90 shadow-sm scale-105"
                        : isCurrent
                        ? "border-2 border-primary bg-surface text-primary shadow-md scale-110"
                        : "border border-border bg-surface-secondary text-text-muted cursor-not-allowed"
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
                    whitespace-nowrap
                    transition-colors
                    ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isCompleted
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary font-medium"
                    }
                  `}
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1
                    h-0.5
                    mx-3
                    transition-colors
                    duration-200
                    ${
                      currentStep > step.number
                        ? "bg-primary"
                        : "bg-border"
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