import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { storeApi } from "@/api/client";

// http://localhost:5173/checkout/payment/stripe/return?session_id=cs_test_a1Xt3KtISuU3RxLX0PHZYFfrHDKVY5n7GsWmIUFz0H6SGud0oAMAITBvWA

type PaymentStatus = "processing" | "success" | "error";

export const StripeReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id")?.trim();

  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [message, setMessage] = useState(
    "جاري التحقق من حالة الدفع، يرجى الانتظار...",
  );
  const [orderId, setOrderId] = useState<number | null>(null);

  const requestStarted = useRef(false);
  const displayedStatus: PaymentStatus = sessionId ? status : "error";
  const displayedMessage = sessionId
    ? message
    : "رابط العودة لا يحتوي على معرّف جلسة الدفع.";

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
          setMessage(responseMessage ?? "تم تأكيد الدفع بنجاح.");
        } else if (paymentStatus === "unpaid") {
          setStatus("error");
          setMessage("لم يتم تأكيد الدفع. يمكنك مراجعة طلبك والمحاولة مرة أخرى.");
        } else {
          setStatus("processing");
          setMessage("الدفع لم يكتمل تأكيده بعد. يرجى مراجعة حالة الطلب.");
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
          apiMessage ?? "تعذر التحقق من حالة الدفع مع Stripe.",
        );
      }
    };

    void verifyPayment();
  }, [sessionId, navigate]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[var(--color-background)] p-4">
      <div className="w-full max-w-md space-y-5 rounded-[var(--radius-2xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-xl)] animate-in fade-in zoom-in-95 duration-200">
        {displayedStatus === "processing" && (
          <div
            role="status"
            aria-label="جاري التحقق من الدفع"
            className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"
          />
        )}

        {displayedStatus === "success" && (
          <div
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600"
          >
            ✓
          </div>
        )}

        {displayedStatus === "error" && (
          <div
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-600"
          >
            ✕
          </div>
        )}

        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          {displayedStatus === "processing" && "جاري التحقق من الدفع"}
          {displayedStatus === "success" && "تم تأكيد الدفع بنجاح"}
          {displayedStatus === "error" && "تعذر تأكيد الدفع"}
        </h2>

        <p
          role="status"
          aria-live="polite"
          className="text-xs leading-relaxed text-[var(--color-text-secondary)]"
        >
          {displayedMessage}
        </p>

        {displayedStatus !== "processing" && (
          <div className="space-y-2.5">

            {displayedStatus === "success" && orderId && (
              <button
                type="button"
                onClick={() => navigate(`/orders/${orderId}`, { replace: true })}
                className="w-full rounded-[var(--radius-xl)] bg-[var(--color-primary)] px-4 py-3 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                عرض تفاصيل الطلب (#{orderId})
              </button>
            )}

            {/* زر الانتقال إلى قائمة الطلبات */}
            <button
              type="button"
              onClick={() => navigate("/orders", { replace: true })}
              className="w-full rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-xs font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)]"
            >
              الانتقال إلى قائمة الطلبات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeReturnPage;