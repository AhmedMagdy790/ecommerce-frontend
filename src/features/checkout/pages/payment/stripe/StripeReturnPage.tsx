// src/pages/Order/StripeReturnPage.tsx

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { storeApi } from "@/api/client";
import { Container } from "@/shared/components/layout/Container";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/ui/Button";
import { Loader2, Check, X } from "lucide-react";

type PaymentStatus = "processing" | "success" | "error";

export const StripeReturnPage: React.FC = () => {
  const { t } = useTranslation("order");
  const { isRTL, lang } = useLang();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id")?.trim();

  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [message, setMessage] = useState(
    lang === "ar" ? "جاري التحقق من حالة الدفع، يرجى الانتظار..." : "Verifying payment status, please wait..."
  );
  const [orderId, setOrderId] = useState<number | null>(null);

  const requestStarted = useRef(false);
  const displayedStatus: PaymentStatus = sessionId ? status : "error";
  const displayedMessage = sessionId
    ? message
    : (lang === "ar" ? "رابط العودة لا يحتوي على معرّف جلسة الدفع." : "Return URL is missing the payment session ID.");

  useEffect(() => {
    if (!sessionId || requestStarted.current) {
      return;
    }

    requestStarted.current = true;

    const verifyPayment = async () => {
      try {
        const response = await storeApi.getStripeCheckoutStatus({
          session_id: sessionId,
        });

        const responseData = response?.data;
        const paymentData = responseData?.payment;
        
        const paymentStatus = paymentData?.payment_status;
        const fetchedOrderId = paymentData?.order_id;
        const responseMessage = responseData?.payment?.message;

        if (fetchedOrderId) {
          setOrderId(fetchedOrderId);
        }

        if (paymentStatus === "paid" || paymentData?.paid === true) {
          setStatus("success");
          setMessage(responseMessage ?? (lang === "ar" ? "تم تأكيد الدفع بنجاح." : "Payment confirmed successfully."));
        } else if (paymentStatus === "unpaid") {
          setStatus("error");
          setMessage(lang === "ar" ? "لم يتم تأكيد الدفع. يمكنك مراجعة طلبك والمحاولة مرة أخرى." : "Payment not confirmed. You can review your order and try again.");
        } else {
          setStatus("processing");
          setMessage(lang === "ar" ? "الدفع لم يكتمل تأكيده بعد. يرجى مراجعة حالة الطلب." : "Payment confirmation is still pending. Please check order status.");
        }
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

        setMessage(
          apiMessage ?? (lang === "ar" ? "تعذر التحقق من حالة الدفع مع Stripe." : "Failed to verify payment status with Stripe.")
        );
      }
    };

    void verifyPayment();
  }, [sessionId, lang]);

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-h-[85vh] items-center justify-center bg-background py-12 transition-colors duration-[var(--duration-normal)]"
    >
      <Container size="sm">
        <div className="w-full rounded-panel border border-border bg-surface p-8 text-center shadow-xs space-y-5">
          
          {displayedStatus === "processing" && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {displayedStatus === "success" && (
            <div
              aria-hidden="true"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5"
            >
              <Check size={32} strokeWidth={2.5} />
            </div>
          )}

          {displayedStatus === "error" && (
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
            {displayedStatus === "processing" && (lang === "ar" ? "جاري التحقق من الدفع" : "Verifying Payment")}
            {displayedStatus === "success" && (lang === "ar" ? "تم تأكيد الدفع بنجاح" : "Payment Confirmed")}
            {displayedStatus === "error" && (lang === "ar" ? "تعذر تأكيد الدفع" : "Verification Failed")}
          </h2>

          <p
            role="status"
            aria-live="polite"
            className="text-xs leading-relaxed text-text-secondary"
            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
          >
            {displayedMessage}
          </p>

          {displayedStatus !== "processing" && (
            <div className="space-y-3 pt-3">

              {displayedStatus === "success" && orderId && (
                <Button
                  type="button"
                  onClick={() => navigate(`/orders/${orderId}`, { replace: true })}
                  className="w-full py-3 text-xs font-bold"
                >
                  {lang === "ar" ? `عرض تفاصيل الطلب (#${orderId})` : `View Order Details (#${orderId})`}
                </Button>
              )}

              {/* الانتقال إلى قائمة الطلبات */}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/orders", { replace: true })}
                className="w-full py-3 text-xs font-bold"
              >
                {t("success.viewOrders", { defaultValue: lang === "ar" ? "الانتقال إلى قائمة الطلبات" : "Go to Orders List" })}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};

export default StripeReturnPage;