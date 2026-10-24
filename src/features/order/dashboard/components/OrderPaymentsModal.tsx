import { useRetryOrderPayment } from "@/pages/Profile/hooks/useRetryOrderPayment";
import React from "react";

interface PaymentAttempt {
  id: number | string;
  gateway: string;
  amount: number | string;
  currency: string;
  status: string;
  failure_reason?: string | null;
  created_at: string;
  payment_gateway_id?: number | null;
}

interface OrderPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | string;
  attempts?: PaymentAttempt[];
}

const getAttemptStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    succeeded: "bg-emerald-100 text-emerald-800 border-emerald-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    failed: "bg-rose-100 text-rose-800 border-rose-200",
  };
  return styles[status.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const OrderPaymentsModal: React.FC<OrderPaymentsModalProps> = ({
  isOpen,
  onClose,
  orderId,
  attempts = [],
}) => {
  const { mutate: retryPayment, isPending: isRetrying } = useRetryOrderPayment();

  if (!isOpen) return null;


  const handleRetry = (gatewayId?: number | null) => {
    const parsedGatewayId =  Number(gatewayId);
    
    retryPayment(
      { orderId, paymentGatewayId: parsedGatewayId },
      {
        onSuccess: (response: any) => {


          const checkoutUrl = response?.data?.payment?.checkout_url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          }
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] shadow-xl w-full max-w-lg overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* رأس الـ Modal */}
        <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
              محاولات الدفع وسجل المعاملات
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              يمكنك متابعة حالة الدفع أو إعادة المحاولة للطلب #{orderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* محتوى المحاولات */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {attempts.length === 0 ? (
            <div className="text-center py-8 text-xs text-[var(--color-text-muted)] italic">
              لا توجد محاولات دفع مسجلة لهذا الطلب حتى الآن.
            </div>
          ) : (
            attempts.map((attempt) => (

              <div
                key={attempt.id}
                className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-3 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[var(--color-text-primary)] uppercase text-sm">
                    {attempt.gateway}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getAttemptStatusBadge(
                      attempt.status
                    )}`}
                  >
                    {attempt.status}
                  </span>
                </div>

                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>المبلغ: <strong className="text-[var(--color-text-primary)]">{attempt.amount} {attempt.currency}</strong></span>
                  <span>{new Date(attempt.created_at).toLocaleString()}</span>
                </div>

                {attempt.failure_reason && (
                  <div className="text-rose-600 bg-rose-50 p-2 rounded border border-rose-100 text-[11px]">
                    <span className="font-semibold">سبب الفشل:</span> {attempt.failure_reason}
                  </div>
                )}

                {/* 🟢 زر إعادة الدفع المخصص لهذه البوابة المحددة */}
                <div className="flex justify-end pt-1 border-t border-[var(--color-border)]/50">
                  <button
                    onClick={() => handleRetry(Number(attempt.payment_gateway_id))}
                    disabled={isRetrying}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {isRetrying ? "جاري..." : `الدفع بواسطة ${attempt.gateway}`}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* أزرار الإجراءات السفلي */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] transition"
          >
            إغلاق
          </button>

          <button
            onClick={() => handleRetry(null)}
            disabled={isRetrying}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow transition disabled:opacity-50"
          >
            {isRetrying ? "جاري المعالجة..." : "إعادة محاولة الدفع بأحدث بوابة"}
          </button>

        </div>

      </div>
    </div>
  );
};