import React from "react";
import { useNavigate } from "react-router-dom";

export const PayPalCancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[var(--color-background)] p-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[var(--radius-2xl)] shadow-[var(--shadow-xl)] max-w-md w-full text-center space-y-5">
        
        {/* أيقونة الإلغاء */}
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
          !
        </div>

        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          تم إلغاء عملية الدفع
        </h2>

        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          لم يتم خصم أي مبلغ من حسابك. يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع مختلفة.
        </p>

        <div className="pt-3 flex gap-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-1/2 py-3 px-4 bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-[var(--button-text)] rounded-[var(--radius-xl)] text-xs font-semibold shadow-[var(--shadow-md)] transition duration-[var(--duration-normal)]"
          >
            العودة للدفع
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-1/2 py-3 px-4 border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] rounded-[var(--radius-xl)] text-xs font-semibold transition duration-[var(--duration-normal)]"
          >
            سلة المشتريات
          </button>
        </div>

      </div>
    </div>
  );
};