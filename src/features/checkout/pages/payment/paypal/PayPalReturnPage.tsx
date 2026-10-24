import { storeApi } from "@/api/client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

type PaymentStatus = "processing" | "success" | "error";

export const PayPalReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [message, setMessage] = useState(
    "جاري تأكيد عملية الدفع، يرجى الانتظار...",
  );

  const requestStarted = useRef(false);

  const token = searchParams.get("token");
  const hasValidToken = Boolean(token?.trim());
  const displayStatus: PaymentStatus = hasValidToken ? status : "error";
  const displayMessage = hasValidToken
    ? message
    : "بيانات العودة من PayPal غير صالحة أو مفقودة.";

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
            "تم تأكيد الدفع بنجاح.",
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

        setMessage(apiMessage ?? "فشل تأكيد عملية الدفع مع PayPal.");
      }
    };

    void confirmPayment();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, navigate]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md space-y-5 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-xl)] animate-in fade-in zoom-in-95 duration-200">
        {displayStatus === "processing" && (
          <div
            role="status"
            aria-label="جاري معالجة الدفع"
            className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"
          />
        )}

        {displayStatus === "success" && (
          <div
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600 shadow-inner"
          >
            ✓
          </div>
        )}

        {displayStatus === "error" && (
          <div
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-600 shadow-inner"
          >
            ✕
          </div>
        )}

        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          {displayStatus === "processing" && "جاري معالجة الدفع"}
          {displayStatus === "success" && "تم تأكيد الدفع بنجاح"}
          {displayStatus === "error" && "عذرًا، حدث خطأ"}
        </h2>

        <p
          role="status"
          aria-live="polite"
          className="text-xs leading-relaxed text-[var(--color-text-secondary)]"
        >
          {displayMessage}
        </p>

        {displayStatus !== "processing" && (
          <div className="pt-3">
            <button
              type="button"
              onClick={() => navigate("/orders", { replace: true })}
              className="w-full rounded-[var(--radius-xl)] bg-[var(--button-bg)] px-4 py-3 text-xs font-semibold text-[var(--button-text)] shadow-[var(--shadow-md)] transition duration-[var(--duration-normal)] hover:bg-[var(--button-bg-hover)]"
            >
              الانتقال إلى طلباتي
            </button>
          </div>
        )}
      </div>
    </div>
  );
};