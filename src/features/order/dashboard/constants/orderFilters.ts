// src/features/order/constants/orderFilters.ts
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { OrderFilters } from "../../model/types/order.types";


export const getOrderFilters = (
  t: TFunction
): FilterField<OrderFilters>[] => [
  {
    key: "status",
    label: t("order.filters.status", "Order Status"),
    type: "select",
    placeholder: t("order.filters.status_placeholder", "Filter by status"),
    options: [
      {
        label: t("filters.all", "All"),
        value: "",
      },
      {
        label: t("order_status.pending", "Pending"),
        value: "pending",
      },
      {
        label: t("order_status.processing", "Processing"),
        value: "processing",
      },
      {
        label: t("order_status.shipped", "Shipped"),
        value: "shipped",
      },
      {
        label: t("order_status.completed", "Completed"),
        value: "completed",
      },
      {
        label: t("order_status.cancelled", "Cancelled"),
        value: "cancelled",
      },
      {
        label: t("order_status.returned", "Returned"),
        value: "returned",
      },
    ],
  },
  {
    key: "payment_status",
    label: t("order.filters.payment_status", "Payment Status"),
    type: "select",
    placeholder: t("order.filters.payment_status_placeholder", "Filter by payment status"),
    options: [
      {
        label: t("filters.all", "All"),
        value: "",
      },
      {
        label: t("payment_status.paid", "Paid"),
        value: "paid",
      },
      {
        label: t("payment_status.unpaid", "Unpaid"),
        value: "unpaid",
      },
      {
        label: t("payment_status.partial", "Partial"),
        value: "partial",
      },
      {
        label: t("payment_status.refunded", "Refunded"),
        value: "refunded",
      },
    ],
  },
];