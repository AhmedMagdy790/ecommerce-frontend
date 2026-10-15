import type { Column } from "@/shared/components/DataTable/types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import type { ShippingCourier } from "../../model/types/shipping.types";
import type { TranslatedText } from "@/shared/types/types";

interface GetShippingCourierColumnsProps {
  t: TFunction;
  lang: string;
  showTrashed?: boolean;
  togglingId?: number | string | null;
  onStatusChange?: (id: number | string, status: boolean) => void;
}

export function getShippingCourierColumns({
  t,
  lang,
  showTrashed,
  togglingId,
  onStatusChange,
}: GetShippingCourierColumnsProps): Column<ShippingCourier<TranslatedText>>[] {
  return [
    {
      id: "name",
      header: t("shipping.courierName", "Courier Name"),
      accessor: (row) => getLocalizedName(row.name, lang),
    },
    {
      id: "code",
      header: t("shipping.code", "Code"),
      accessor: "code",
      render: (value) => (
        <span className="px-2 py-1 bg-[var(--color-surface-muted)] rounded text-xs font-mono">
          {String(value)}
        </span>
      ),
    },
    {
      id: "phone",
      header: t("shipping.phone", "Phone"),
      accessor: (row) => row.phone || "---",
    },
    {
      id: "supports_cod",
      header: t("shipping.supportsCod", "Supports COD"),
      accessor: "supports_cod",
      render: (value) => {
        const supportsCod = Boolean(value);
        return (
          <span className={`text-xs font-semibold ${supportsCod ? "text-[var(--color-success)]" : "text-[var(--color-text-secondary)]"}`}>
            {supportsCod ? t("common.yes", "Yes") : t("common.no", "No")}
          </span>
        );
      },
    },
    {
      id: "is_active",
      header: t("common.status", "Status"),
      accessor: "is_active",
      render: (value, row) => {
        const isActive = Boolean(value);
        const isLoadingThis = togglingId === row.id;

        return (
          <button
            type="button"
            disabled={showTrashed || isLoadingThis}
            onClick={() => {
              if (showTrashed || isLoadingThis || !onStatusChange) return;
              onStatusChange(row.id, !isActive);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              showTrashed || isLoadingThis
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:opacity-80"
            } ${
              isActive
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20"
            }`}
            title={!showTrashed ? t("status.toggle", "Click to change status") : undefined}
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