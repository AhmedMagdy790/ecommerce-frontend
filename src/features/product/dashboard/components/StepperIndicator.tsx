import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  steps?: string[];
}

export const StepperIndicator = ({ 
  currentStep, 
  steps = ["البيانات", "المتغيرات", "الوسائط"] 
}: StepperProps) => {
  return (
    <div className="flex items-center justify-center w-full py-4 mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <div key={index} className="flex items-center">
            {/* Step Circle & Number */}
            <div className="relative flex flex-col items-center">
              <div
                className={`
                  w-10 
                  h-10 
                  rounded-full 
                  flex 
                  items-center 
                  justify-center 
                  border-2 
                  transition-all 
                  duration-[var(--duration-normal)]
                  ${
                    isCompleted
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[var(--shadow-xs)]"
                      : isActive
                      ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-background)] shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
                      : "border-[var(--color-border)] text-[var(--color-text-muted)] bg-[var(--color-background)]"
                  }
                `}
              >
                {isCompleted ? <Check size={20} /> : <span className="text-xs font-bold">{stepNumber}</span>}
              </div>
              
              {/* Step Label */}
              <span 
                className={`
                  absolute 
                  -bottom-7 
                  text-[11px] 
                  font-bold 
                  whitespace-nowrap 
                  transition-colors 
                  duration-[var(--duration-fast)]
                  ${
                    isActive 
                      ? "text-[var(--color-primary)]" 
                      : "text-[var(--color-text-muted)]"
                  }
                `}
              >
                {step}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="w-16 md:w-24 h-[2px] mx-2 bg-[var(--color-border)] relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[var(--color-primary)] transition-all duration-[var(--duration-normal)]"
                  style={{ width: isCompleted ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};