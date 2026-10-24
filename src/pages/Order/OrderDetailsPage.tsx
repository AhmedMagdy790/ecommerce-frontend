// pages/Order/OrderDetailsPage.tsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  AlertCircle,
  Phone,
  Mail,
  User,
  Truck
} from "lucide-react";

import { useOrderById } from "@/features/order/hook/useOrderById";
import { StatusBadge } from "@/features/order/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { OrderSkeleton } from "@/features/order/components/OrderSkeleton";
import { mapOrderToViewModel } from "./utils/order.mapper";
import type { OrderItem } from "@/features/order/model/types/order.types";

export default function OrderDetailsPage() {
  const { t, i18n } = useTranslation("order");
  const { id } = useParams<{ id: string }>();

  const isValidId = Boolean(id && id.trim() !== "");
  const { order: rawOrder, isLoading, error } = useOrderById(isValidId ? id : undefined);

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (!isValidId || error || !rawOrder) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold">
            {t("details.notFound", "الطلب غير موجود")}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t("details.notFoundDesc", "عذراً، لم نتمكن من العثور على تفاصيل هذا الطلب.")}
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-white transition hover:opacity-90"
          >
            <ArrowLeft size={16} />
            {t("back", "العودة للطلبات")}
          </Link>
        </div>
      </main>
    );
  }

  const order = mapOrderToViewModel(rawOrder);
  const formatPrice = (value: number) => formatCurrency(value, order.currency);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 text-right" dir="rtl">
      {/* زر العودة */}
      <Link
        to="/orders"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] transition hover:underline"
      >
        <ArrowLeft size={16} />
        {t("back", "العودة للطلبات")}
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* القسم الرئيسي */}
        <section className="space-y-6">
          {/* رأس الصفحة ورقم الطلب */}
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {t("details.title", "تفاصيل الطلب")}
                </h1>
                <p className="mt-2 text-sm font-mono font-bold text-[var(--color-text-primary)]">
                  #{order.orderNumber}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString(i18n.language) : ""}
                </p>
              </div>

              <div>
                <StatusBadge status={order?.status} />
              </div>
            </div>
          </div>

          {/* قائمة المنتجات */}
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-[var(--color-border)] pb-4">
              <ShoppingBag size={20} className="text-[var(--color-primary)]" />
              <h2 className="text-xl font-semibold">
                {t("details.items", "منتجات الطلب")} ({order.itemsCount})
              </h2>
            </div>

            <div className="space-y-4">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] p-4 transition hover:bg-[var(--color-surface-secondary)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-[var(--color-surface-secondary)] flex items-center justify-center border border-[var(--color-border)] overflow-hidden">
                      {item.image ? (
                        <img src={item.image} className="h-full w-full object-cover" />
                      ) : (
                        <Package size={28} className="text-[var(--color-text-secondary)]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {t("details.quantity", "الكمية")}: {item.quantity}
                      </p>
                      {Number(item?.weight) > 0 && (
                        <span className="text-xs text-[var(--color-text-secondary)] block mt-0.5">
                          الوزن: {item.weight} كجم
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="font-bold text-base self-end sm:self-center">
                    {formatPrice(item.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* معلومات الشحن والعميل */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* عنوان الشحن */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-[var(--color-primary)]">
                <MapPin size={20} />
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {t("details.shipping", "معلومات الشحن")}
                </h2>
              </div>

              <div className="space-y-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                <p className="font-medium text-[var(--color-text-primary)]">{order.customerName}</p>
                <p>{order.shippingAddress}</p>
                {order.cityName && (
                  <p>المدينة: {order.cityName}</p>
                )}
                {order.courierName && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--color-border)] text-xs">
                    <Truck size={14} className="text-[var(--color-primary)]" />
                    <span>شركة الشحن: <strong className="text-[var(--color-text-primary)]">{order.courierName}</strong></span>
                  </div>
                )}
                {order.trackingNumber && (
                  <p className="font-mono text-xs mt-1">رقم التتبع: {order.trackingNumber}</p>
                )}
              </div>
            </div>

            {/* بيانات العميل */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-[var(--color-primary)]">
                <User size={20} />
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {t("details.customer", "بيانات العميل")}
                </h2>
              </div>

              <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2" dir="ltr">
                  <Phone size={16} />
                  <span>{order.customerPhone}</span>
                </div>
                {order.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{order.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* الشريط الجانبي (الملخص) */}
        <aside className="sticky top-24 h-fit space-y-6">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold border-b border-[var(--color-border)] pb-3">
              {t("details.summary", "ملخص الفاتورة")}
            </h2>

            <div className="space-y-4">
              <Row
                label={t("subtotal", "المجموع الفرعي")}
                value={formatPrice(order.subTotal)}
              />

              <Row
                label={t("shipping", "رسوم الشحن")}
                value={
                  order.isShippingFree ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                      {t("shipping.free", "مجاني")}
                    </span>
                  ) : (
                    formatPrice(order.shippingCost)
                  )
                }
              />

              {order.discountAmount > 0 && (
                <Row
                  label={t("discount", "الخصم")}
                  value={`-${formatPrice(order.discountAmount)}`}
                />
              )}

              <hr className="border-[var(--color-border)] my-2" />

              <Row
                label={t("total", "الإجمالي الكلي")}
                value={formatPrice(order.totalAmount)}
                bold
              />
            </div>

            {/* طريقة الدفع */}
            <div className="mt-8 rounded-2xl bg-[var(--color-surface-secondary)] p-4 border border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-[var(--color-primary)]" />
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {t("details.payment", "طريقة الدفع")}
                    </p>
                    <p className="font-semibold text-sm capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {order.notes && (
              <div className="mt-4 rounded-2xl bg-[var(--color-surface-secondary)] p-4 border border-[var(--color-border)] text-xs">
                <span className="font-semibold block mb-1 text-[var(--color-text-primary)]">ملاحظات العميل:</span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{order.notes}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

interface RowProps {
  label: string;
  value: string | React.ReactNode;
  bold?: boolean;
  className?: string;
}

function Row({ label, value, bold = false, className = "" }: RowProps) {
  return (
    <div className={`flex items-center justify-between text-sm ${className}`}>
      <span className={bold ? "text-base font-bold text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}>
        {label}
      </span>
      <span className={bold ? "text-lg font-extrabold text-[var(--color-primary)]" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}