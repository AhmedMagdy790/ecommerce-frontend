// features/order/components/StatusBadge.tsx
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
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