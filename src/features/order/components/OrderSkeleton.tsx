// src/features/order/components/OrderSkeleton.tsx

import { Container } from "@/shared/components/layout/Container";

export const OrderSkeleton = () => {
  return (
    <main className="min-h-[70vh] flex items-center justify-center py-10 bg-background transition-colors duration-[var(--duration-normal)]">
      <Container size="md">
        <div className="w-full animate-pulse rounded-panel border border-border bg-surface p-6 sm:p-10 text-center shadow-xs">
          
          {/* Icon Placeholder */}
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-surface-secondary border border-border" />

          {/* Title/Message Placeholders */}
          <div className="mx-auto h-8 w-3/4 rounded-card bg-surface-secondary" />
          <div className="mx-auto mt-4 h-4 w-1/2 rounded-card bg-surface-secondary" />

          {/* Details Placeholder */}
          <div className="mt-8 space-y-4 rounded-card border border-border bg-surface-secondary p-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-border" />
                <div className="h-4 w-24 rounded bg-border" />
              </div>
            ))}
          </div>

          {/* Button Placeholders */}
          <div className="mt-8 space-y-3">
            <div className="h-12 w-full rounded-card bg-surface-secondary border border-border" />
            <div className="h-12 w-full rounded-card bg-surface-secondary border border-border" />
          </div>

        </div>
      </Container>
    </main>
  );
};