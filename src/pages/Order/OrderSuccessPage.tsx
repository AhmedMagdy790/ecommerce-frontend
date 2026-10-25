// pages/Order/OrderSuccessPage.tsx

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  CheckCircle, 
  ShoppingBag, 
  AlertCircle, 
  MapPin, 
  CreditCard, 
  Package
} from "lucide-react";

import { useOrderById } from "@/features/order/hook/useOrderById";
import { OrderSummaryRow } from "@/features/order/components/OrderSummaryRow";
import { Button } from "@/shared/components/ui/Button";
import { StatusBadge } from "@/features/order/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { OrderSkeleton } from "@/features/order/components/OrderSkeleton";
import { mapOrderToViewModel } from "./utils/order.mapper";
import { Container } from "@/shared/components/layout/Container";
import { useLang } from "@/shared/context/LanguageContext";

export default function OrderSuccessPage() {
  const { t } = useTranslation("order");
  const { isRTL, lang } = useLang();
  const { id } = useParams();

  const isValidId = Boolean(id && id.trim() !== "");
  const { order: rawOrder, isLoading, error } = useOrderById(isValidId ? id : undefined);

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (!isValidId || error || !rawOrder) {
    return (
      <main 
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-[75vh] flex items-center justify-center py-12"
      >
        <Container size="sm">
          <div className="w-full rounded-panel border border-border bg-surface p-8 text-center shadow-xs">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertCircle size={40} />
            </div>
            <h1 
              className="text-2xl font-bold text-text-primary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("errors.orderNotFound", { defaultValue: lang === "ar" ? "الطلب غير موجود" : "Order Not Found" })}
            </h1>
            <p 
              className="mt-3 text-sm text-text-secondary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("errors.invalidOrderSlug", { defaultValue: lang === "ar" ? "رابط الطلب غير صالح أو أن الطلب غير مسجل لدينا." : "Invalid order link or the order is not registered." })}
            </p>
            <div className="mt-8">
              <Button variant="outline" to="/shop" className="w-full">
                {t("success.continueShopping", { defaultValue: lang === "ar" ? "العودة للتسوق" : "Continue Shopping" })}
              </Button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // تحويل البيانات الخام عبر الـ Mapper
  const order = mapOrderToViewModel(rawOrder);
  const formatPrice = (val: number) => formatCurrency(val, order.currency);

  return (
    <main 
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-[80vh] flex items-center justify-center py-12 bg-background text-text-primary transition-colors duration-[var(--duration-normal)]"
    >
      <Container size="md">
        <div className="w-full rounded-panel border border-border bg-surface p-6 sm:p-10 shadow-xs transition-all">
          
          {/* Header / Success Banner */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
              <CheckCircle size={44} />
            </div>
            <h1 
              className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("success.title", { defaultValue: lang === "ar" ? "تم إتمام طلبك بنجاح!" : "Order placed successfully!" })}
            </h1>
            <p 
              className="mt-2 text-sm sm:text-base text-text-secondary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {t("success.message", { defaultValue: lang === "ar" ? "شكراً لك، يتم تجهيز طلبك الآن للشحن والتوصيل." : "Thank you, your order is now being processed for shipping." })}
            </p>
          </div>

          {/* Order Meta Box (Number & Status) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-card bg-surface-secondary p-4 border border-border">
            <div>
              <span 
                className="text-xs text-text-secondary block font-medium"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {t("success.orderNumber", { defaultValue: lang === "ar" ? "رقم الطلب" : "Order Number" })}
              </span>
              <span className="text-base font-bold font-mono tracking-wide text-text-primary">
                #{order.orderNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Details Grid (Shipping & Payment) */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Shipping Address */}
            <div className="rounded-card border border-border bg-surface-secondary p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <MapPin size={18} />
                <span 
                  className="text-sm"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {t("success.shippingAddress", { defaultValue: lang === "ar" ? "عنوان الشحن" : "Shipping Address" })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {order.shippingAddress}
              </p>
              {order.cityName && (
                <span 
                  className="mt-2 text-xs font-semibold text-text-primary"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {lang === "ar" ? "المدينة: " : "City: "} {order.cityName}
                </span>
              )}
            </div>

            {/* Payment Info */}
            <div className="rounded-card border border-border bg-surface-secondary p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <CreditCard size={18} />
                <span 
                  className="text-sm"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {t("success.paymentMethod", { defaultValue: lang === "ar" ? "طريقة الدفع" : "Payment Method" })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-text-secondary uppercase font-semibold">
                  {order.paymentMethod}
                </span>
                <span className={`px-2 py-0.5 rounded-card text-xs font-bold ${
                  order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.customerPhone && (
                <span 
                  className="mt-2 text-xs text-text-secondary font-medium"
                  style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                >
                  {lang === "ar" ? "هاتف التواصل: " : "Phone: "} {order.customerPhone}
                </span>
              )}
            </div>

          </div>

          {/* Financial Breakdown (Financial Summary) */}
          <div className="mt-6 rounded-card border border-border bg-surface-secondary p-5 space-y-3">
            <div 
              className="flex items-center gap-2 text-sm font-bold border-b border-border pb-3 text-text-primary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              <Package size={18} className="text-primary" />
              <span>{t("success.summary", { defaultValue: lang === "ar" ? "ملخص الحساب" : "Financial Summary" })}</span>
            </div>

            <OrderSummaryRow
              label={t("success.subtotal", { defaultValue: lang === "ar" ? "المجموع الفرعي" : "Subtotal" })}
              value={formatPrice(order.subTotal)}
            />
            <OrderSummaryRow
              label={t("success.shippingCost", { defaultValue: lang === "ar" ? "رسوم الشحن" : "Shipping Cost" })}
              value={formatPrice(order.shippingCost)}
            />
            {order.discountAmount > 0 && (
              <OrderSummaryRow
                label={t("success.discount", { defaultValue: lang === "ar" ? "الخصم" : "Discount" })}
                value={`-${formatPrice(order.discountAmount)}`}
              />
            )}
            <OrderSummaryRow
              label={t("success.total", { defaultValue: lang === "ar" ? "الإجمالي الكلي" : "Total" })}
              value={formatPrice(order.totalAmount)}
              className="border-t border-border pt-3 text-base font-bold text-primary"
            />
          </div>

          {/* Actions Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              to={`/orders/${id}`}
              icon={<ShoppingBag size={18} />}
              className="flex-1 py-3"
            >
              {t("success.viewOrder", { defaultValue: lang === "ar" ? "تفاصيل الطلب" : "View Order Details" })}
            </Button>

            <Button variant="outline" to="/shop" className="flex-1 py-3">
              {t("success.continueShopping", { defaultValue: lang === "ar" ? "متابعة التسوق" : "Continue Shopping" })}
            </Button>
          </div>

        </div>
      </Container>
    </main>
  );
}