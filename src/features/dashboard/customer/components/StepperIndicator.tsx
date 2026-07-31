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
            {/* الدائرة والرقم */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isActive
                    ? "border-primary text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <Check size={20} /> : <span>{stepNumber}</span>}
              </div>
              
              {/* نص الخطوة */}
              <span className={`absolute -bottom-7 text-[11px] font-bold whitespace-nowrap transition-colors duration-300 ${
                isActive ? "text-primary" : "text-gray-400"
              }`}>
                {step}
              </span>
            </div>

            {/* الخط الواصل بين الدوائر */}
            {index < steps.length - 1 && (
              <div className="w-16 md:w-24 h-[2px] mx-2 bg-gray-100 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
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