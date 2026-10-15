// src/features/payment/dashboard/constants/paymentGatewayColumns.ts
import type { Column } from "@/shared/components/DataTable/types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import type { PaymentGateway } from "../../model/types/payment.types";

interface GetPaymentGatewayColumnsProps {
  t: TFunction;
  lang: string;
  showTrashed?: boolean;
  togglingId?: number | string | null;
  onStatusChange?: (id: number | string, status: boolean) => void;
}

export function getPaymentGatewayColumns({
  t,
  lang,
  showTrashed,
  togglingId,
  onStatusChange,
}: GetPaymentGatewayColumnsProps): Column<PaymentGateway>[] {
  return [
    {
      id: "name",
      header: t("payment.gatewayName", "Gateway Name"),
      accessor: (row) => getLocalizedName(row.name, lang),
    },
    {
      id: "slug",
      header: t("payment.slug", "Slug"),
      accessor: "slug",
      render: (value) => (
        <span className="px-2 py-1 bg-[var(--color-surface-muted)] rounded text-xs font-mono">
          {String(value)}
        </span>
      ),
    },
    {
      id: "type",
      header: t("payment.type", "Type"),
      accessor: "type",
      render: (value) => (
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          {String(value)}
        </span>
      ),
    },
    {
      id: "is_test_mode",
      header: t("payment.testMode", "Test Mode"),
      accessor: "is_test_mode",
      render: (value) => {
        const isTest = Boolean(value);
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
            isTest 
              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
          }`}>
            {isTest ? t("payment.test", "Test") : t("payment.live", "Live")}
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