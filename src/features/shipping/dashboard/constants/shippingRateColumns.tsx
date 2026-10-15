// src/features/shipping/constants/shippingRateColumns.ts

import type { Column } from "@/shared/components/DataTable/types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import type { TranslatedText } from "@/shared/types/types";
import type { ShippingRate } from "../../model/types/rate.types";

interface GetShippingRateColumnsProps {
  t: TFunction;
  lang: string;
  togglingId?: number | string | null;
  onStatusChange?: (id: number | string, status: boolean) => void;
}

export function getShippingRateColumns({
  t,
  lang,
  togglingId,
  onStatusChange,
}: GetShippingRateColumnsProps): Column<ShippingRate<TranslatedText>>[] {
  return [
    {
      id: "city",
      header: t("shipping.city", "City"),
      accessor: (row) => row.city ? getLocalizedName(row.city.name, lang) : "---",
    },
    {
      id: "courier",
      header: t("shipping.courier", "Courier"),
      accessor: (row) => row.courier ? getLocalizedName(row.courier.name, lang) : "---",
    },
    {
      id: "shipping_fee",
      header: t("shipping.fee", "Shipping Fee"),
      accessor: (row) => row.fees?.shipping_fee,
      render: (_value, row) => (
        <span className="font-semibold text-[var(--color-text-primary)]">
          {Number(row.fees?.shipping_fee || 0).toFixed(2)} {row.currency || "USD"}
        </span>
      ),
    },
    {
      id: "estimated_delivery",
      header: t("shipping.estimatedDelivery", "Delivery Time"),
      accessor: (row) => `${row.delivery_time?.from ?? 1} - ${row.delivery_time?.to ?? 3} ${t("shipping.days", "Days")}`,
    },
    {
      id: "cod_fee",
      header: t("shipping.codFee", "COD Fee"),
      accessor: (row) => row.fees?.cod_fee,
      render: (_value, row) => (
        <span className="text-xs text-[var(--color-text-secondary)]">
          {Number(row.fees?.cod_fee || 0).toFixed(2)} {row.currency || "USD"}
        </span>
      ),
    },
    {
      id: "is_active",
      header: t("common.status", "Status"),
      accessor: (row) => row.settings?.is_active,
      render: (_value, row) => {
  
        const isActive = Boolean(row.settings?.is_active);
        const isLoadingThis = togglingId === row.id;

        return (
          <button
            type="button"
            disabled={isLoadingThis}
            onClick={() => {
              if (isLoadingThis || !onStatusChange) return;
              onStatusChange(row.id, !isActive);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              isLoadingThis
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:opacity-80"
            } ${
              isActive
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20"
            }`}
            title={t("status.toggle", "Click to change status")}
          >
            {isLoadingThis && (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            <span>
              {isActive
                ? t("status.active", "Active")
                : t("status.inactive", "Inactive")}
            </span>
          </button>
        );
      },
    },
  ];
}