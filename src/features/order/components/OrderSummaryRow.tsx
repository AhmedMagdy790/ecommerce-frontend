// src/features/order/components/OrderSummaryRow.tsx
import { cn } from "@/lib/utils";

interface OrderSummaryRowProps {
  label: string;
  value: React.ReactNode;
  className?: string; // Always allow overriding styles
}

export const OrderSummaryRow = ({ label, value, className }: OrderSummaryRowProps) => (
  <div className={cn("flex items-center justify-between py-1", className)}>
    <span className="text-[var(--color-text-secondary)]">{label}</span>
    <span className="font-semibold text-[var(--color-text-primary)]">{value}</span>
  </div>
);