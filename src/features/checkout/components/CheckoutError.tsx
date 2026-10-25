// src/pages/Checkout/CheckoutError.tsx

import { AlertCircle } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

interface CheckoutErrorProps {
  error: string;
}

export default function CheckoutError({ error }: CheckoutErrorProps) {
  const { isRTL, lang } = useLang();

  if (!error) return null;

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"}
      className="flex items-center gap-3 rounded-card border border-red-500/30 bg-red-500/10 p-4 text-start animate-fade-in"
    >
      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
      <p 
        className="text-sm font-semibold text-red-600 dark:text-red-400 leading-relaxed"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {error}
      </p>
    </div>
  );
}