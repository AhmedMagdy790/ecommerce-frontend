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

export default function OrderSuccessPage() {
  const { t } = useTranslation("order");
  const { id } = useParams();

  const isValidId = Boolean(id && id.trim() !== "");
  const { order: rawOrder, isLoading, error } = useOrderById(isValidId ? id : undefined);

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (!isValidId || error || !rawOrder) {
    return (
      <main className="container mx-auto flex min-h-[75vh] max-w-lg items-center justify-center px-4 py-10">
        <div className="w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-8 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold">{t("errors.orderNotFound", "الطلب غير موجود")}</h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            {t("errors.invalidOrderSlug", "رابط الطلب غير صالح أو أن الطلب غير مسجل لدينا.")}
          </p>
          <div className="mt-8">
            <Button variant="outline" to="/shop" className="w-full">
              {t("success.continueShopping", "العودة للتسوق")}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // تحويل البيانات الخام عبر الـ Mapper
  const order = mapOrderToViewModel(rawOrder);
  const formatPrice = (val: number) => formatCurrency(val, order.currency);

  return (
    <main className="container mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 sm:p-10 shadow-xl transition-all">
        
        {/* Header / Success Banner */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/5">
            <CheckCircle size={44} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("success.title", "تم إتمام طلبك بنجاح!")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--color-text-secondary)]">
            {t("success.message", "شكراً لك، يتم تجهيز طلبك الآن للشحن والتوصيل.")}
          </p>
        </div>

        {/* Order Meta Box (Number & Status) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-[var(--color-surface,var(--color-muted))] p-4 border border-[var(--color-border)]">
          <div>
            <span className="text-xs text-[var(--color-text-secondary)] block">
              {t("success.orderNumber", "رقم الطلب")}
            </span>
            <span className="text-base font-bold font-mono tracking-wide">
              #{order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Details Grid (Shipping & Payment) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
          
          {/* Shipping Address */}
          <div className="rounded-2xl border border-[var(--color-border)] p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold mb-2">
              <MapPin size={18} />
              <span className="text-sm">{t("success.shippingAddress", "عنوان الشحن")}</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {order.shippingAddress}
            </p>
            {order.cityName && (
              <span className="mt-2 text-xs font-medium text-[var(--color-text)]">
                المدينة: {order.cityName}
              </span>
            )}
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl border border-[var(--color-border)] p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold mb-2">
              <CreditCard size={18} />
              <span className="text-sm">{t("success.paymentMethod", "طريقة الدفع")}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[var(--color-text-secondary)] uppercase font-medium">
                {order.paymentMethod}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.customerPhone && (
              <span className="mt-2 text-xs text-[var(--color-text-secondary)]">
                هاتف التواصل: {order.customerPhone}
              </span>
            )}
          </div>

        </div>

        {/* Financial Breakdown (Financial Summary) */}
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold border-b border-[var(--color-border)] pb-3">
            <Package size={18} />
            <span>{t("success.summary", "ملخص الحساب")}</span>
          </div>

          <OrderSummaryRow
            label={t("success.subtotal", "المجموع الفرعي")}
            value={formatPrice(order.subTotal)}
          />
          <OrderSummaryRow
            label={t("success.shippingCost", "رسوم الشحن")}
            value={formatPrice(order.shippingCost)}
          />
          {order.discountAmount > 0 && (
            <OrderSummaryRow
              label={t("success.discount", "الخصم")}
              value={`-${formatPrice(order.discountAmount)}`}
            />
          )}
          <OrderSummaryRow
            label={t("success.total", "الإجمالي الكلي")}
            value={formatPrice(order.totalAmount)}
            className="border-t border-[var(--color-border)] pt-3 text-base font-bold text-[var(--color-primary)]"
          />
        </div>

        {/* Actions Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            to={`/orders/${id}`}
            icon={<ShoppingBag size={18} />}
            className="flex-1 py-3"
          >
            {t("success.viewOrder", "تفاصيل الطلب")}
          </Button>

          <Button variant="outline" to="/shop" className="flex-1 py-3">
            {t("success.continueShopping", "متابعة التسوق")}
          </Button>
        </div>

      </div>
    </main>
  );
}