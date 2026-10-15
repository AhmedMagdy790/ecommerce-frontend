import { Package, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InventoryStatsProps {
    totalCount: number;
    activeCount: number;
}

export function InventoryStats({
    totalCount,
    activeCount,
}: InventoryStatsProps) {
    const { t } = useTranslation("inventory");

    return (
        <div className="grid md:grid-cols-2 gap-4 text-[var(--color-text-secondary)]">
            {/* Total Inventory Items */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--card-bg)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
                <div className="flex gap-4 items-center">
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--blue-50)] text-[var(--color-primary)]">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                            {t("stats.total_inventory", "Total Inventory Items")}
                        </p>
                        <p className="font-bold text-xl text-[var(--color-text-primary)] mt-0.5">
                            {totalCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Active Inventory Items */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--card-bg)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
                <div className="flex gap-4 items-center">
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-success)]/10 text-[var(--color-success)]">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                            {t("stats.active_inventory", "Active Inventory Items")}
                        </p>
                        <p className="font-bold text-xl text-[var(--color-text-primary)] mt-0.5">
                            {activeCount}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}