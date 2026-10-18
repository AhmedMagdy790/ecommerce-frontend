// src/features/checkout/components/CheckoutSummarySkeleton.tsx

export default function CheckoutSummarySkeleton() {
  return (
    <div className="space-y-3 py-1 animate-pulse">
      {[1, 2].map((index) => (
        <div key={index} className="flex items-center justify-between gap-3">
          {/* الصورة + العنوان والكمية */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* مكان الصورة */}
            <div className="h-12 w-12 rounded-md bg-[var(--color-border)] opacity-60 shrink-0" />

            {/* تفاصيل النص */}
            <div className="space-y-2 min-w-0 flex-1">
              <div className="h-4 w-3/4 rounded bg-[var(--color-border)] opacity-60" />
              <div className="h-3 w-1/3 rounded bg-[var(--color-border)] opacity-60" />
            </div>
          </div>

          {/* السعر */}
          <div className="h-4 w-12 rounded bg-[var(--color-border)] opacity-60 shrink-0" />
        </div>
      ))}
    </div>
  );
}