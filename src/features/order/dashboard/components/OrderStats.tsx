// src/features/order/components/OrderStats.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { 
  Clock, 
  RefreshCw, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShoppingBag, 
  Trash2 
} from "lucide-react";
import type { OrderStatsData, OrderStatus } from "../../model/types/order.types";

interface OrderStatsProps {
  stats: OrderStatsData | null;
  selectedStatus?: OrderStatus | '' | 'trashed';
  onSelectStatus?: (status: OrderStatus | '' | 'trashed') => void;
}

export const OrderStats: React.FC<OrderStatsProps> = ({
  stats,
  selectedStatus,
  onSelectStatus,
}) => {
  const { t } = useTranslation();

  const statItems = [
    {
      key: "" as const,
      label: t("order.stats.total", "Total Orders"),
      value: stats?.total,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    },
    {
      key: "pending" as OrderStatus,
      label: t("order.stats.pending", "Pending"),
      value: stats?.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    },
    {
      key: "processing" as OrderStatus,
      label: t("order.stats.processing", "Processing"),
      value: stats?.processing,
      icon: RefreshCw,
      color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-900",
    },
    {
      key: "shipped" as OrderStatus,
      label: t("order.stats.shipped", "Shipped"),
      value: stats?.shipped,
      icon: Truck,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-900",
    },
    {
      key: "completed" as OrderStatus,
      label: t("order.stats.completed", "Completed"),
      value: stats?.completed,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    },
    {
      key: "cancelled" as OrderStatus,
      label: t("order.stats.cancelled", "Cancelled"),
      value: stats?.cancelled,
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    },
    {
      key: "returned" as OrderStatus,
      label: t("order.stats.returned", "Returned"),
      value: stats?.returned,
      icon: RotateCcw,
      color: "text-gray-600 bg-gray-50 dark:bg-gray-800/40 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    },
    ...(stats?.trashed !== undefined ? [{
      key: "trashed" as const,
      label: t("order.stats.trashed", "Trash"),
      value: stats?.trashed,
      icon: Trash2,
      color: "text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-900",
    }] : []),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedStatus === item.key;

        return (
          <div
            key={item.key || "total"}
            onClick={() => onSelectStatus?.(item.key)}
            className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
              isSelected
                ? "ring-2 ring-[var(--color-primary)] border-transparent shadow-md"
                : "hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg border ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {item.value?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};