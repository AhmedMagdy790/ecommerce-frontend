
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Package,
  CalendarDays,
  MapPin,
  CreditCard,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useOrders } from "../hooks/useOrders";
import { mapOrdersList } from "../../../features/order/dashboard/mappers/mapOrderData";
import { OrderPaymentsModal } from "@/features/order/dashboard/components/OrderPaymentsModal";
import type { Order } from "@/features/order/model/types/order.types";
import { ROUTES } from "@/constants/navigation";

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  processing: "border-blue-200 bg-blue-50 text-blue-800",
  shipped: "border-indigo-200 bg-indigo-50 text-indigo-800",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  failed: "border-rose-200 bg-rose-50 text-rose-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
  refunded: "border-blue-200 bg-blue-50 text-blue-800",
};

const FALLBACK_STATUS_STYLE =
  "border-border bg-surface-secondary text-text-secondary";

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={[
        "inline-flex max-w-full items-center rounded-full border",
        "px-2.5 py-1 text-[11px] font-semibold leading-4",
        className,
      ].join(" ")}
    >
      <span className="truncate">{label}</span>
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

function OrderDetail({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      {icon && (
        <span className="mt-0.5 shrink-0 text-text-muted">
          {icon}
        </span>
      )}

      <div className="min-w-0">
        <p className="text-xs text-text-secondary">{label}</p>
        <div className="mt-1 break-words text-sm font-semibold text-text-primary">
          {value}
        </div>
      </div>
    </div>
  );
}

function OrdersSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} className="space-y-4 py-2">
      <span className="sr-only">{label}</span>

      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse space-y-4 rounded-panel border border-border bg-surface p-4 sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="size-11 shrink-0 rounded-xl bg-surface-secondary" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-32 max-w-full rounded bg-surface-secondary" />
              <div className="h-3 w-24 max-w-full rounded bg-surface-secondary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 rounded bg-surface-secondary" />
            <div className="h-10 rounded bg-surface-secondary" />
          </div>

          <div className="h-12 rounded-lg bg-surface-secondary" />
        </div>
      ))}
    </div>
  );
}

export default function OrdersSection() {
  const { t, i18n } = useTranslation("profile");
  const { orders: rawOrders, isLoading, isError } = useOrders();

  const [selectedOrder, setSelectedOrder] =
    useState<Order<string> | null>(null);

  const orders = mapOrdersList(rawOrders);
  const isArabic = i18n.resolvedLanguage?.startsWith("ar") ?? false;
  const locale = isArabic ? "ar-EG" : "en-US";
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  if (isLoading) {
    return <OrdersSkeleton label={t("sections.orders.loading")} />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-panel border border-rose-200 bg-rose-50/60 px-5 py-10 text-center"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
          <AlertCircle size={24} />
        </div>

        <h3 className="font-semibold text-text-primary">
          {t("sections.orders.error", "حدث خطأ أثناء تحميل الطلبات.")}
        </h3>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-panel border border-border bg-surface px-5 py-12 text-center sm:py-16">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShoppingBag size={30} strokeWidth={1.7} />
        </div>

        <h3 className="text-lg font-bold text-text-primary">
          {t("sections.orders.empty_title", "لا توجد طلبات حتى الآن")}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
          {t(
            "sections.orders.empty",
            "لم تقم بأي طلبات شراء بعد. استعرض المنتجات وابدأ تسوقك الآن.",
          )}
        </p>

        <Link
          to={ROUTES.SHOP || "/shop"}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("sections.orders.start_shopping", "تصفح المتجر")}</span>
          <DirectionArrow size={17} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="mb-6 space-y-1 border-b border-border pb-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-text-primary">
              {t("sections.orders.title")}
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {t("sections.orders.description")}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-surface-secondary px-3 py-1.5 text-xs font-semibold text-text-secondary">
            {orders.length}
          </span>
        </div>
      </header>

      <div className="space-y-4 sm:space-y-5">
        {orders.map((order) => {
          const orderStatus = order.status ?? "unknown";
          const paymentStatus = order.payment?.status ?? "unknown";

          const canRetryPayment =
            paymentStatus !== "paid" &&
            orderStatus !== "cancelled" &&
            orderStatus !== "completed";

          const orderStatusClass =
            ORDER_STATUS_STYLES[orderStatus] ?? FALLBACK_STATUS_STYLE;

          const paymentStatusClass =
            PAYMENT_STATUS_STYLES[paymentStatus] ?? FALLBACK_STATUS_STYLE;

          return (
            <article
              key={order.id}
              className={[
                "overflow-hidden rounded-panel border border-border",
                "bg-surface transition-colors duration-200",
                "hover:border-primary/30",
              ].join(" ")}
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ReceiptText size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-text-secondary">
                      {t("sections.orders.orderNumber")}
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-text-primary">
                      {order.order_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <CalendarDays size={15} className="shrink-0" />
                  <time dateTime={order.created_at ?? undefined}>
                    {formatDate(order.created_at, locale)}
                  </time>
                </div>
              </div>

              {/* Order details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 px-4 py-5 sm:grid-cols-2 sm:gap-x-6 sm:px-5 md:grid-cols-4">
                <OrderDetail
                  icon={<MapPin size={16} />}
                  label={t("sections.orders.location")}
                  value={order.city?.name || "—"}
                />

                <OrderDetail
                  icon={<ShoppingBag size={16} />}
                  label={t("sections.orders.itemsCount")}
                  value={order.items_count ?? 0}
                />

                <OrderDetail
                  icon={<CreditCard size={16} />}
                  label={t("sections.orders.paymentMethod")}
                  value={order.payment?.method || "—"}
                />

                <div className="min-w-0">
                  <p className="mb-1.5 text-xs text-text-secondary">
                    {t("sections.orders.paymentStatus")}
                  </p>

                  <StatusBadge
                    label={t(`paymentStatus.${paymentStatus}`, {
                      defaultValue: paymentStatus,
                    })}
                    className={paymentStatusClass}
                  />
                </div>
              </div>

              {/* Status and total */}
              <div className="space-y-4 border-t border-border/70 bg-surface-secondary/30 px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="text-xs text-text-secondary">
                      {t("sections.orders.orderStatus")}
                    </span>

                    <StatusBadge
                      label={t(`orderStatus.${orderStatus}`, {
                        defaultValue: orderStatus,
                      })}
                      className={orderStatusClass}
                    />
                  </div>

                  <div className="min-w-0 text-end">
                    <p className="text-xs text-text-secondary">
                      {t("sections.orders.total")}
                    </p>

                    <p className="mt-1 text-base font-extrabold text-text-primary">
                      {order.amounts?.total_amount ?? "—"}{" "}
                      <span className="text-xs font-medium text-text-secondary">
                        {order.amounts?.currency || "EGP"}
                      </span>
                    </p>
                  </div>
                </div>

                {canRetryPayment && (
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className={[
                      "flex min-h-11 w-full items-center justify-center gap-2",
                      "rounded-control bg-primary px-4 py-3",
                      "text-sm font-semibold text-text-inverse",
                      "transition-colors hover:bg-primary-hover",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      "sm:w-auto sm:min-w-40",
                    ].join(" ")}
                  >
                    <RefreshCw size={16} />
                    {t("sections.orders.managePayment", "إدارة الدفع")}
                    <ChevronRight size={16} className="rtl:rotate-180" />
                  </button>
                )}
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