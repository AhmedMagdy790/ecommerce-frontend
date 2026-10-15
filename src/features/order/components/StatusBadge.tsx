// features/order/components/StatusBadge.tsx
import { cn } from "@/lib/utils";
import type { OrderStatus } from "../model/types/order.types";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-green-100 text-green-700",
    returned: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider",
        styles[status],
        className
      )}
    >
      {status}
    </span>
  );
};