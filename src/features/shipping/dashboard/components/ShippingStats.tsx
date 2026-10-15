// src/features/shipping/components/ShippingStats.tsx
import { memo } from "react";
import GlobalStatusBadge from "@/shared/components/GlobalStatusBadge";

interface StatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    trashed?: number;
  } | null;
  showTrashed?: boolean;
}

const ShippingStats = memo(function ShippingStats({ 
  stats, 
  showTrashed = true
}: StatsProps) {
  if (!stats) return null;

  // بناء القائمة ديناميكياً بناءً على تفعيل الـ showTrashed ووجود القيمة
  const statItems = [
    { status: "total", value: stats.total },
    { status: "active", value: stats.active },
    { status: "inactive", value: stats.inactive },
    ...(showTrashed && stats.trashed !== undefined 
      ? [{ status: "trashed", value: stats.trashed }] 
      : []),
  ];

  // تحديد عدد الأعمدة تلقائياً بناءً على عدد العناصر (3 أو 4 أعمدة)
  const gridColsClass = statItems.length === 3 
    ? "grid-cols-1 sm:grid-cols-3" 
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridColsClass} gap-4`}>
      {statItems.map((item, index) => (
        <div
          key={index}
          className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm flex items-center justify-between"
        >
          <div>
            {/* استخدام GlobalStatusBadge ليعرض الشارة والاسم والأيقونة المعيارية */}
            <GlobalStatusBadge status={item.status} />
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
              {item.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
});

export default ShippingStats;