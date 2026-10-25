// src/pages/Order/PayPalReturnPage.tsx

import { storeApi } from "@/api/client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container } from "@/shared/components/layout/Container";
import { useLang } from "@/shared/context/LanguageContext";
import { Loader2, Check, X } from "lucide-react";

type PaymentStatus = "processing" | "success" | "error";

export const PayPalReturnPage: React.FC = () => {
  const { t } = useTranslation("order");
  const { isRTL, lang } = useLang();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [message, setMessage] = useState(
    lang === "ar" ? "جاري تأكيد عملية الدفع، يرجى الانتظار..." : "Confirming payment, please wait..."
  );

  const requestStarted = useRef(false);

  const token = searchParams.get("token");
  const hasValidToken = Boolean(token?.trim());
  const displayStatus: PaymentStatus = hasValidToken ? status : "error";
  const displayMessage = hasValidToken
    ? message
    : (lang === "ar" ? "بيانات العودة من PayPal غير صالحة أو مفقودة." : "PayPal return data is invalid or missing.");

  useEffect(() => {
    const paypalToken = token?.trim();

    if (!paypalToken || requestStarted.current) {
      return;
    }

    requestStarted.current = true;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const confirmPayment = async () => {
      try {
        const response = await storeApi.getPaypalCapture({
          paypal_token: paypalToken,
        });

        setStatus("success");
        setMessage(
          response?.data?.data?.message ??
            response?.data?.message ??
            (lang === "ar" ? "تم تأكيد الدفع بنجاح." : "Payment confirmed successfully.")
        );

        const orderId = response?.data?.data?.order_id;

        timeoutId = setTimeout(() => {
          navigate(orderId ? `/orders/${orderId}` : "/orders", {
            replace: true,
          });
        }, 3000);
      } catch (error: unknown) {
        setStatus("error");

        const apiMessage =
          typeof error === "object" &&
          error !== null &&
          "response" in error
            ? (
                error as {
                  response?: {
                    data?: { message?: string };
                  };
                }
              ).response?.data?.message
            : undefined;

        setMessage(apiMessage ?? (lang === "ar" ? "فشل تأكيد عملية الدفع مع PayPal." : "Failed to confirm payment with PayPal."));
      }
    };

    void confirmPayment();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, navigate, lang]);

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-h-[85vh] items-center justify-center bg-background py-12 transition-colors duration-[var(--duration-normal)]"
    >
      <Container size="sm">
        <div className="w-full rounded-panel border border-border bg-surface p-8 text-center shadow-xs space-y-5">
          
          {displayStatus === "processing" && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {displayStatus === "success" && (
            <div
              aria-hidden="true"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5"
            >
              <Check size={32} strokeWidth={2.5} />
            </div>
          )}

          {displayStatus === "error" && (
            <div
              aria-hidden="true"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-8 ring-rose-500/5"
            >
              <X size={32} strokeWidth={2.5} />
            </div>
          )}

          <h2 
            className="text-xl font-bold text-text-primary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {displayStatus === "processing" && (lang === "ar" ? "جاري معالجة الدفع" : "Processing Payment")}
            {displayStatus === "success" && (lang === "ar" ? "تم تأكيد الدفع بنجاح" : "Payment Confirmed")}
            {displayStatus === "error" && (lang === "ar" ? "عذرًا، حدث خطأ" : "Oops, an error occurred")}
          </h2>

          <p
            role="status"
            aria-live="polite"
            className="text-xs leading-relaxed text-text-secondary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {displayMessage}
          </p>

          {displayStatus !== "processing" && (
            <div className="pt-3">
              <button
                type="button"
                onClick={() => navigate("/orders", { replace: true })}
                className="w-full rounded-card bg-primary px-4 py-3 text-xs font-bold text-white shadow-xs transition duration-[var(--duration-normal)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {t("success.viewOrders", { defaultValue: lang === "ar" ? "الانتقال إلى طلباتي" : "Go to My Orders" })}
              </button>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};