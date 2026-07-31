// pages/Order/OrderSuccessPage.tsx
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useOrderById } from "@/features/order/hook/useOrderById";
import { OrderSummaryRow } from "@/features/order/components/OrderSummaryRow";
import { Button } from "@/shared/components/ui/Button";
import { StatusBadge } from "@/features/order/components/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { OrderSkeleton } from "@/features/order/components/OrderSkeleton";

export default function OrderSuccessPage() {
  const { t } = useTranslation("order");
  const { id } = useParams();
  const { order, isLoading } = useOrderById(id);


  if (isLoading) return <OrderSkeleton />;

  return (
    <main className="container mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-8 text-center">
        
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-success)] text-white">
          <CheckCircle size={42} />
        </div>

        <h1 className="text-3xl font-bold">{t("success.title")}</h1>
        <p className="mt-4 text-[var(--color-text-secondary)]">{t("success.message")}</p>

        {/* Order Details */}
        <div className="mt-6 space-y-2 text-right">
          <OrderSummaryRow label={t("success.orderNumber")} value={`#${order?.order_number || order?.id}`} />
          <OrderSummaryRow label={t("success.status")} value={<StatusBadge status={order?.status} />} />
          <OrderSummaryRow label={t("success.total")} value={formatCurrency(order?.amounts?.total_amount ?? order?.total_amount ?? 0)} className="border-t pt-2 mt-2" />
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Button to={`/orders/${id}`} icon={<ShoppingBag size={18} />}>
            {t("success.viewOrder")}
          </Button>
          <Button variant="outline" to="/shop">
            {t("success.continueShopping")}
          </Button>
        </div>
      </div>
    </main>
  );
}