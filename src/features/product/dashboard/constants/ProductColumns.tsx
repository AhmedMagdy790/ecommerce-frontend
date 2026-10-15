// src/features/product/components/ProductColumns.tsx
import { LayersIcon } from "lucide-react";
import type { TFunction } from "i18next";
import type { Product, ProductStatus } from "../../model/types/product.types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TranslatedText } from "@/shared/types/types";
import type { Column } from "@/shared/components/DataTable/types";

interface GetProductColumnsProps {
    t: TFunction;
    lang: string;
    showTrashed: boolean;
    onStatusChange: (id: number | string, status: ProductStatus) => void;
}

export type LocalizedProduct = Product<TranslatedText>;

export function getProductColumns({
    t,
    lang,
    showTrashed,
    onStatusChange,
}: GetProductColumnsProps): Column<LocalizedProduct>[] {
    return [
        {
            header: t("columns.name"),
            accessor: (item: LocalizedProduct) => getLocalizedName(item.name, lang),
        },
        {
            header: t("columns.brand"),
            accessor: (item: LocalizedProduct) => {
                if (!item.brand) return "-";
                return getLocalizedName(item.brand.name, lang);
            },
        },
        {
            header: t("columns.category"),
            accessor: (item: LocalizedProduct) => {

                return getLocalizedName(item?.category?.name ?? "", lang);
            },
        },
        {
            header: t("columns.status"),
            accessor: "status",
            render: (status: unknown, item: LocalizedProduct) => {
                const currentStatus = status as ProductStatus;
                return (
                    <button
                        type="button"
                        onClick={() => onStatusChange(item.id, currentStatus)}
                        disabled={showTrashed}
                        className={`
                            px-3 py-1 rounded-full text-xs font-medium transition-transform active:scale-95
                            ${currentStatus === "active"
                                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20"
                                : currentStatus === "draft"
                                    ? "bg-[var(--warning-500)]/10 text-[var(--warning-600)] border border-[var(--warning-500)]/20"
                                    : "bg-[var(--red-500)]/10 text-[var(--color-error)] border border-[var(--red-500)]/20"
                            }
                        `}
                    >
                        {t(`status.${currentStatus}`, currentStatus)}
                    </button>
                );
            },
        },
        {
            header: t("columns.variants"),
            accessor: (item: LocalizedProduct) => (
                <span className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] px-2.5 py-1 rounded-[var(--radius-md)] text-xs font-medium shadow-[var(--shadow-xs)]">
                    <LayersIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    {item.variants?.length || 0}
                </span>
            ),
        },
    ];
}