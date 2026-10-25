// src/features/order/components/OrderSummaryRow.tsx

import { cn } from "@/lib/utils";
import { useLang } from "@/shared/context/LanguageContext";

interface OrderSummaryRowProps {
  label: string;
  value: React.ReactNode;
  className?: string; // Always allow overriding styles
}

export const OrderSummaryRow = ({ label, value, className }: OrderSummaryRowProps) => {
  const { isRTL, lang } = useLang();

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"}
      className={cn("flex items-center justify-between py-1.5", className)}
    >
      <span 
        className="text-sm text-text-secondary"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {label}
      </span>
      <span 
        className="text-sm font-semibold text-text-primary"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {value}
      </span>
    </div>
  );
};