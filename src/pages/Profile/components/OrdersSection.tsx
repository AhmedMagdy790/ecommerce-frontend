
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useOrders } from "../hooks/useOrders";
import { mapOrdersList } from "../../../features/order/dashboard/mappers/mapOrderData";
import { OrderPaymentsModal } from "@/features/order/dashboard/components/OrderPaymentsModal";
import type { Order } from "@/features/order/model/types/order.types";


const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  processing: "border-blue-200 bg-blue-50 text-blue-800",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  failed: "border-rose-200 bg-rose-50 text-rose-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  refunded: "border-blue-200 bg-blue-50 text-blue-800",
};

function StatusBadge({
  className,
  label,
}: {
  status: string | null | undefined;
  className: string;
  label: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-1",
        "text-[10px] font-bold uppercase",
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function formatDate(
  value: string | null | undefined,
  locale: string,
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function OrdersSection() {
  const { t, i18n } = useTranslation("profile");
  const { orders: rawOrders, isLoading, isError } = useOrders();

  const [selectedOrder, setSelectedOrder] =
    useState<Order<string> | null>(null);

  const orders = mapOrdersList(rawOrders);
  const locale = i18n.resolvedLanguage?.startsWith("ar")
    ? "ar-EG"
    : "en-US";

  if (isLoading) {
    return (
      <div role="status" className="space-y-4 py-6">
        <span className="sr-only">{t("sections.orders.loading")}</span>

        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-panel border border-border p-5"
          >
            <div className="h-4 w-1/3 animate-pulse rounded-control bg-surface-secondary" />
            <div className="h-4 w-2/3 animate-pulse rounded-control bg-surface-secondary" />
            <div className="h-8 w-full animate-pulse rounded-control bg-surface-secondary" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-panel border border-border bg-surface-secondary p-6 text-center"
      >
        <p className="text-sm text-text-primary">
          {t("sections.orders.error")}
        </p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="py-12 text-center text-sm text-text-muted">
        {t("sections.orders.empty")}
      </div>
    );
  }

  return (
    <>
      <header className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">
          {t("sections.orders.title")}
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          {t("sections.orders.description")}
        </p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => {
          const orderStatus = order.status ?? "unknown";
          const paymentStatus = order.payment?.status ?? "unknown";

          const canRetryPayment =
            paymentStatus !== "paid" &&
            orderStatus !== "cancelled" &&
            orderStatus !== "completed";

          const orderStatusClass =
            ORDER_STATUS_STYLES[orderStatus] ??
            "border-border bg-surface-secondary text-text-secondary";

          const paymentStatusClass =
            PAYMENT_STATUS_STYLES[paymentStatus] ??
            "border-border bg-surface-secondary text-text-secondary";

          return (
            <article
              key={order.id}
              className="space-y-4 rounded-panel border border-border bg-surface-secondary p-5 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <span className="block text-xs text-text-muted">
                    {t("sections.orders.orderNumber")}
                  </span>

                  <span className="text-sm font-bold text-text-primary">
                    {order.order_number}
                  </span>
                </div>

                <div className="text-start">
                  <span className="block text-xs text-text-muted">
                    {t("sections.orders.date")}
                  </span>

                  <time
                    dateTime={order.created_at ?? undefined}
                    className="text-xs font-medium text-text-secondary"
                  >
                    {formatDate(order.created_at, locale)}
                  </time>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
                <div>
                  <span className="block text-text-muted">
                    {t("sections.orders.location")}
                  </span>

                  <span className="font-semibold text-text-primary">
                    {order.city?.name || "—"}
                  </span>
                </div>

                <div>
                  <span className="block text-text-muted">
                    {t("sections.orders.itemsCount")}
                  </span>

                  <span className="font-semibold text-text-primary">
                    {order.items_count ?? 0}
                  </span>
                </div>

                <div>
                  <span className="block text-text-muted">
                    {t("sections.orders.paymentMethod")}
                  </span>

                  <span className="font-semibold uppercase text-text-primary">
                    {order.payment?.method || "—"}
                  </span>
                </div>

                <div>
                  <span className="mb-1 block text-text-muted">
                    {t("sections.orders.paymentStatus")}
                  </span>

                  <StatusBadge
                    status={paymentStatus}
                    label={t(`paymentStatus.${paymentStatus}`, {
                      defaultValue: paymentStatus,
                    })}
                    className={paymentStatusClass}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-text-muted">
                    {t("sections.orders.orderStatus")}
                  </span>

                  <StatusBadge
                    status={orderStatus}
                    label={t(`orderStatus.${orderStatus}`, {
                      defaultValue: orderStatus,
                    })}
                    className={orderStatusClass}
                  />

                  {canRetryPayment && (
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-control bg-primary px-3 py-2 text-xs font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {t("sections.orders.managePayment")}
                    </button>
                  )}
                </div>

                <div className="text-start">
                  <span className="me-2 text-xs text-text-muted">
                    {t("sections.orders.total")}
                  </span>

                  <span className="text-base font-extrabold text-text-primary">
                    {order.amounts?.total_amount ?? "—"}{" "}
                    <span className="text-xs font-normal">
                      {order.amounts?.currency || "EGP"}
                    </span>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {selectedOrder && (
        <OrderPaymentsModal
          isOpen
          onClose={() => setSelectedOrder(null)}
          orderId={selectedOrder.id}
          attempts={selectedOrder.payment?.attempts ?? []}
        />
      )}
    </>
  );
}