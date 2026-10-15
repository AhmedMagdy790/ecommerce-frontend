import { useTranslation } from "react-i18next";
import type { InventoryStats } from "../../model/types/inventory.types";

interface InventoryStatusCardsProps {
    status?: InventoryStats | null; // 👈 استقبال الـ status من الخارج
}

export function InventoryStatusCards({ status }: InventoryStatusCardsProps) {
    const { t } = useTranslation("inventory");

    // استخدام القيم الواردة أو قيم افتراضية تجنباً للأخطاء
    const stats = status || {
        total: 0,
        in_stock: 0,
        low_stock: 0,
        out_of_stock: 0,
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Items */}
            <div className="p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm">
                <p className="text-sm text-[var(--color-text-secondary)]">
                    {t("stats.total", "Total Items")}
                </p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stats.total}
                </p>
            </div>

            {/* In Stock */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {t("stats.in_stock", "In Stock")}
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.in_stock}
                </p>
            </div>

            {/* Low Stock */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                    {t("stats.low_stock", "Low Stock")}
                </p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.low_stock}
                </p>
            </div>

            {/* Out of Stock */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 shadow-sm">
                <p className="text-sm text-rose-600 dark:text-rose-400">
                    {t("stats.out_of_stock", "Out of Stock")}
                </p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {stats.out_of_stock}
                </p>
            </div>
        </div>
    );
}