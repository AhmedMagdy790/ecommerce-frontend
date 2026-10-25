// src/pages/Order/StripeCancelPage.tsx

import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { XCircle } from "lucide-react";
import { Container } from "@/shared/components/layout/Container";
import { useLang } from "@/shared/context/LanguageContext";

export default function StripeCancelPage() {
  const { t } = useTranslation("checkout");
  const { isRTL, lang } = useLang();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-h-[85vh] items-center justify-center bg-background py-12 transition-colors duration-[var(--duration-normal)]"
    >
      <Container size="sm">
        <section className="w-full rounded-panel border border-border bg-surface p-8 text-center shadow-xs space-y-5">
          <XCircle
            className="mx-auto h-16 w-16 text-amber-500 animate-fade-in"
            aria-hidden="true"
          />

          <h1 
            className="text-2xl font-bold text-text-primary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("stripe.canceledTitle", { defaultValue: lang === "ar" ? "تم إلغاء الدفع" : "Payment canceled" })}
          </h1>

          <p 
            className="text-xs sm:text-sm leading-relaxed text-text-secondary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {t("stripe.canceledMessage", { 
              defaultValue: lang === "ar" 
                ? "لم يتم إتمام عملية الدفع الخاصة بك. يمكنك العودة إلى صفحة الدفع والمحاولة مرة أخرى." 
                : "Your payment was not completed. You can return to checkout and try again." 
            })}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <Link
              to="/checkout"
              className="rounded-card bg-primary px-5 py-3 text-xs font-bold text-white shadow-xs transition hover:opacity-90 flex items-center justify-center"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("stripe.backToCheckout", { defaultValue: lang === "ar" ? "العودة للدفع" : "Back to checkout" })}
            </Link>

            {orderId && (
              <Link
                to={`/orders/${encodeURIComponent(orderId)}`}
                className="rounded-card border border-border bg-surface-secondary px-5 py-3 text-xs font-bold text-text-primary transition hover:bg-surface flex items-center justify-center"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {t("stripe.viewOrder", { defaultValue: lang === "ar" ? "عرض الطلب" : "View order" })}
              </Link>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}