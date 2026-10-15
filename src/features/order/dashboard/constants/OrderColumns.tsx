// src/features/order/dashboard/components/OrderColumns.tsx

import type { Order, OrderStatus } from "../../model/types/order.types";
import type { TFunction } from "i18next";
import type { Column } from "@/shared/components/DataTable/types";
import type { TranslatedText } from "@/shared/types/types";
import { getLocalizedName } from "@/shared/utils/localizeName";

export const getOrderColumns = (
  t: TFunction,
  lang: string,
  openStatusModal?: (order: Order<TranslatedText>) => void
): Column<Order<TranslatedText>>[] => [
  {
    id: "order_number",
    header: t("order.columns.order_number", "Order Number"),
    accessor: "order_number",
    render: (value) => (
      <span className="font-semibold text-gray-900 dark:text-white">
        {String(value)}
      </span>
    ),
  },
  {
    id: "customer",
    header: t("order.columns.customer", "Customer"),
    accessor: (row) => row.customer?.name ?? "-",
    render: (_, row) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 dark:text-white">
          {row.customer?.name ?? t("common.unknown", "Unknown")}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {row.customer?.phone_primary ?? ""}
        </span>
      </div>
    ),
  },
  {
    id: "city",
    header: t("order.columns.city", "City"),
    accessor: (row) => row.city?.name ?? "-",
    render: (_, row) => (
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {getLocalizedName(row.city?.name ?? "-", lang)}
      </span>
    ),
  },
  {
    id: "total_amount",
    header: t("order.columns.total", "Total"),
    accessor: (row) => row.amounts?.total_amount ?? row.total_amount ?? 0,
    render: (_, row) => {
      const total = row.amounts?.total_amount ?? row.total_amount ?? 0;
      const currency = row.amounts?.currency ?? "EGP";
      return (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {total.toFixed(2)} {currency}
        </span>
      );
    },
  },
{
    id: "status",
    header: t("order.columns.status", "Status"),
    accessor: "status",
    render: (value, row) => {
      const status = value as OrderStatus;
      const statusColors: Record<string, string> = {
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
        processing: "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400",
        shipped: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400",
        completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
        cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400",
        returned: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      };

      return (
        <button
          type="button"
          onClick={() => openStatusModal?.(row)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-transform active:scale-95 cursor-pointer ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
          title={t("order.clickToChangeStatus", "Click to change status")}
        >
          {t(`order_status.${status}`, status)}
        </button>
      );
    },
  },
  {
    id: "payment_status",
    header: t("order.columns.payment_status", "Payment"),
    accessor: "payment_status",
    render: (value) => {
      const paymentStatus = String(value);
      const isPaid = paymentStatus === "paid";

      return (
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
          isPaid 
            ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900" 
            : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
        }`}>
          {t(`payment_status.${paymentStatus}`, paymentStatus)}
        </span>
      );
    },
  },
  {
    id: "created_at",
    header: t("order.columns.date", "Date"),
    accessor: "created_at",
    render: (value) => (
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {String(value)}
      </span>
    ),
  },
  
];