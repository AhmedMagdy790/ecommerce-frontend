// pages/Order/OrderDetailsPage.tsx

import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
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
import { Container } from "@/shared/components/layout/Container";
import { useLang } from "@/shared/context/LanguageContext";

export default function OrderDetailsPage() {
  const { t, i18n } = useTranslation("order");
  const { isRTL, lang } = useLang();
  const { id } = useParams<{ id: string }>();

  const isValidId = Boolean(id && id.trim() !== "");
  const { order: rawOrder, isLoading, error } = useOrderById(isValidId ? id : undefined);

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (!isValidId || error || !rawOrder) {
    return (
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-[70vh] flex items-center justify-center py-10 bg-background"
      >
        <Container size="sm">
          <div className="w-full rounded-panel border border-border bg-surface p-8 text-center shadow-xs">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertCircle size={32} />
            </div>
            <h1 
              className="text-2xl font-bold text-text-primary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("details.notFound", { defaultValue: lang === "ar" ? "الطلب غير موجود" : "Order Not Found" })}
            </h1>
            <p 
              className="mt-2 text-sm text-text-secondary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("details.notFoundDesc", { defaultValue: lang === "ar" ? "عذراً، لم نتمكن من العثور على تفاصيل هذا الطلب." : "Sorry, we could not find details for this order." })}
            </p>
            <Link
              to="/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-card bg-primary px-5 py-3 text-white text-sm font-semibold transition hover:opacity-90"
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}>
                {t("back", { defaultValue: lang === "ar" ? "العودة للطلبات" : "Back to Orders" })}
              </span>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const order = mapOrderToViewModel(rawOrder);
  const formatPrice = (value: number) => formatCurrency(value, order.currency);

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="py-8 bg-background text-text-primary min-h-[85vh] transition-colors duration-[var(--duration-normal)]"
    >
      <Container size="2xl">
        {/* Back Button */}
        <Link
          to="/orders"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{t("back", { defaultValue: lang === "ar" ? "العودة للطلبات" : "Back to Orders" })}</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Section */}
          <section className="space-y-6">
            {/* Header & Order Number */}
            <div className="rounded-panel border border-border bg-surface p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 
                    className="text-2xl sm:text-3xl font-bold text-text-primary"
                    style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  >
                    {t("details.title", { defaultValue: lang === "ar" ? "تفاصيل الطلب" : "Order Details" })}
                  </h1>
                  <p className="mt-2 text-sm font-mono font-bold text-text-primary">
                    #{order.orderNumber}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString(i18n.language) : ""}
                  </p>
                </div>

                <div>
                  <StatusBadge status={order?.status} />
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="rounded-panel border border-border bg-surface p-6 shadow-xs">
              <div className="mb-6 flex items-center gap-2 border-b border-border pb-4">
                <ShoppingBag size={20} className="text-primary" />
                <h2 
                  className="text-xl font-bold text-text-primary"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {t("details.items", { defaultValue: lang === "ar" ? "منتجات الطلب" : "Order Items" })} ({order.itemsCount})
                </h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-card border border-border p-4 bg-surface-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 flex-shrink-0 rounded-card bg-surface border border-border flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image ?? ""} alt={item.name ?? ""} className="h-full w-full object-cover" />
                        ) : (
                          <Package size={28} className="text-text-muted" />
                        )}
                      </div>
                      <div>
                        <h3 
                          className="font-bold text-base text-text-primary"
                          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                        >
                          {item.name}
                        </h3>
                        <p 
                          className="mt-1 text-xs text-text-secondary font-medium"
                          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                        >
                          {t("details.quantity", { defaultValue: lang === "ar" ? "الكمية:" : "Quantity:" })} {item.quantity}
                        </p>
                        {Number(item?.weight) > 0 && (
                          <span 
                            className="text-xs text-text-secondary block mt-0.5 font-medium"
                            style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                          >
                            {lang === "ar" ? "الوزن: " : "Weight: "} {item.weight} {lang === "ar" ? "كجم" : "kg"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-bold text-base text-text-primary self-end sm:self-center">
                      {formatPrice(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Customer Information */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Shipping Address */}
              <div className="rounded-panel border border-border bg-surface p-6 shadow-xs flex flex-col justify-between">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <MapPin size={20} />
                  <h2 
                    className="text-lg font-bold text-text-primary"
                    style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  >
                    {t("details.shipping", { defaultValue: lang === "ar" ? "معلومات الشحن" : "Shipping Information" })}
                  </h2>
                </div>

                <div 
                  className="space-y-2 text-sm text-text-secondary leading-relaxed"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  <p className="font-bold text-text-primary">{order.customerName}</p>
                  <p>{order.shippingAddress}</p>
                  {order.cityName && (
                    <p>{lang === "ar" ? "المدينة: " : "City: "} {order.cityName}</p>
                  )}
                  {order.courierName && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border text-xs">
                      <Truck size={14} className="text-primary" />
                      <span>{lang === "ar" ? "شركة الشحن: " : "Courier: "} <strong className="text-text-primary">{order.courierName}</strong></span>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <p className="font-mono text-xs mt-1 text-text-primary">
                      {lang === "ar" ? "رقم التتبع: " : "Tracking Number: "} {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Data */}
              <div className="rounded-panel border border-border bg-surface p-6 shadow-xs flex flex-col justify-between">
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <User size={20} />
                  <h2 
                    className="text-lg font-bold text-text-primary"
                    style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  >
                    {t("details.customer", { defaultValue: lang === "ar" ? "بيانات العميل" : "Customer Data" })}
                  </h2>
                </div>

                <div 
                  className="space-y-3 text-sm text-text-secondary"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-text-muted" />
                    <span className="font-semibold text-text-primary">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2" dir="ltr">
                    <Phone size={16} className="text-text-muted" />
                    <span className="text-text-primary">{order.customerPhone}</span>
                  </div>
                  {order.customerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-text-muted" />
                      <span className="text-text-primary">{order.customerEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar (Invoice Summary) */}
          <aside className="sticky top-24 h-fit space-y-6">
            <div className="rounded-panel border border-border bg-surface p-6 shadow-xs">
              <h2 
                className="mb-6 text-xl font-bold border-b border-border pb-3 text-text-primary"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {t("details.summary", { defaultValue: lang === "ar" ? "ملخص الفاتورة" : "Invoice Summary" })}
              </h2>

              <div className="space-y-4">
                <Row
                  label={t("subtotal", { defaultValue: lang === "ar" ? "المجموع الفرعي" : "Subtotal" })}
                  value={formatPrice(order.subTotal)}
                />

                <Row
                  label={t("shipping", { defaultValue: lang === "ar" ? "رسوم الشحن" : "Shipping" })}
                  value={
                    order.isShippingFree ? (
                      <span className="rounded-card bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {t("shipping.free", { defaultValue: lang === "ar" ? "مجاني" : "Free" })}
                      </span>
                    ) : (
                      formatPrice(order.shippingCost)
                    )
                  }
                />

                {order.discountAmount > 0 && (
                  <Row
                    label={t("discount", { defaultValue: lang === "ar" ? "الخصم" : "Discount" })}
                    value={`-${formatPrice(order.discountAmount)}`}
                  />
                )}

                <hr className="border-border my-2" />

                <Row
                  label={t("total", { defaultValue: lang === "ar" ? "الإجمالي الكلي" : "Total" })}
                  value={formatPrice(order.totalAmount)}
                  bold
                />
              </div>

              {/* Payment Method Box */}
              <div className="mt-8 rounded-card bg-surface-secondary p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-primary" />
                    <div>
                      <p 
                        className="text-xs text-text-secondary font-medium"
                        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                      >
                        {t("details.payment", { defaultValue: lang === "ar" ? "طريقة الدفع" : "Payment Method" })}
                      </p>
                      <p className="font-bold text-sm text-text-primary uppercase">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-card text-xs font-bold uppercase ${
                    order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {order.notes && (
                <div 
                  className="mt-4 rounded-card bg-surface-secondary p-4 border border-border text-xs"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  <span className="font-bold block mb-1 text-text-primary">
                    {lang === "ar" ? "ملاحظات العميل:" : "Customer Notes:"}
                  </span>
                  <p className="text-text-secondary leading-relaxed">{order.notes}</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
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
  const { lang } = useLang();
  
  return (
    <div 
      className={`flex items-center justify-between text-sm ${className}`}
      style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
    >
      <span className={bold ? "text-base font-bold text-text-primary" : "text-text-secondary font-medium"}>
        {label}
      </span>
      <span className={bold ? "text-lg font-bold text-primary" : "font-bold text-text-primary"}>
        {value}
      </span>
    </div>
  );
}