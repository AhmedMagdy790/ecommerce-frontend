// src/pages/Order/PayPalCancelPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { Container } from "@/shared/components/layout/Container";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/ui/Button";

export const PayPalCancelPage: React.FC = () => {
  const { t } = useTranslation("checkout");
  const { isRTL, lang } = useLang();
  const navigate = useNavigate();

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-h-[85vh] items-center justify-center bg-background py-12 transition-colors duration-[var(--duration-normal)]"
    >
      <Container size="sm">
        <div className="w-full rounded-panel border border-border bg-surface p-8 text-center shadow-xs space-y-5">
          
          {/* Cancel/Warning Icon */}
          <div 
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-8 ring-amber-500/5"
          >
            <AlertTriangle size={32} strokeWidth={2.25} />
          </div>

          <h2 
            className="text-xl font-bold text-text-primary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("paypal.canceledTitle", { defaultValue: lang === "ar" ? "تم إلغاء عملية الدفع" : "Payment Canceled" })}
          </h2>

          <p 
            className="text-xs leading-relaxed text-text-secondary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("paypal.canceledMessage", { 
              defaultValue: lang === "ar" 
                ? "لم يتم خصم أي مبلغ من حسابك. يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع مختلفة." 
                : "No funds were deducted from your account. You can try again or choose a different payment method." 
            })}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate("/checkout")}
              className="flex-1 py-3 text-xs font-bold"
            >
              {t("paypal.returnToCheckout", { defaultValue: lang === "ar" ? "العودة للدفع" : "Return to Checkout" })}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/cart")}
              className="flex-1 py-3 text-xs font-bold"
            >
              {t("paypal.viewCart", { defaultValue: lang === "ar" ? "سلة المشتريات" : "View Cart" })}
            </Button>
          </div>

        </div>
      </Container>
    </main>
  );
};