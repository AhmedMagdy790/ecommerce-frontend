import { useTranslation } from "react-i18next";
import { useOrders } from "../hooks/useOrders";
import { mapOrdersList } from "../../../features/order/dashboard/mappers/mapOrderData";
import { OrderPaymentsModal } from "@/features/order/dashboard/components/OrderPaymentsModal";
import { useState } from "react";
import type { Order } from "@/features/order/model/types/order.types";

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-800 border-rose-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

const getPaymentBadge = (status: string) => {
  return status === "paid" || status === "success"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
    : "bg-amber-50 text-amber-700 border-amber-200";
};

export default function OrdersSection() {
  const { t } = useTranslation("profile");

  const { orders: rawOrders, isLoading, isError } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order<string> | null>(null);

  const orders = mapOrdersList(rawOrders);


  return (
    <section className="bg-[var(--color-surface)] p-6 md:p-8 rounded-[var(--radius-2xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            {t("sections.orders.title")}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("sections.orders.description")}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-[var(--color-text-muted)] text-sm animate-pulse">
          Loading your orders...
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-rose-500 text-sm bg-rose-50 rounded-xl border border-rose-100">
          Failed to load orders. Please try again later.
        </div>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">
          {t("sections.orders.empty")}
        </div>
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] transition-all hover:shadow-md space-y-4"
            >
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[var(--color-border)] pb-3">
                <div>
                  <span className="text-xs text-[var(--color-text-muted)] block">Order Number</span>
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">
                    {order.order_number}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--color-text-muted)] block">Date</span>
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {order.created_at}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[var(--color-text-secondary)]">
                <div>
                  <span className="block text-[var(--color-text-muted)]">City / Location</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {order?.city?.name || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-[var(--color-text-muted)]">Items Count</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {order.items_count} {order.items_count === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <div>
                  <span className="block text-[var(--color-text-muted)]">Payment Method</span>
                  <span className="font-semibold uppercase text-[var(--color-text-primary)]">
                    {order.payment?.method || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-[var(--color-text-muted)]">Payment Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getPaymentBadge(order.payment?.status)}`}>
                    {order.payment?.status}
                  </span>
                </div>
              </div>

              {/* ذيل البطاقة: المجموع، الحالات، وزر إعادة المحاولة إن لم يتم الدفع */}
              <div className="flex flex-wrap justify-between items-center pt-2 border-t border-[var(--color-border)] gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-muted)]">Order Status:</span>
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold capitalize ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>

                  {order.payment?.status !== "paid" && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow transition"
                    >
                      عرض محاولات الدفع / إعادة المحاولة
                    </button>
                  )}

                </div>

                <div className="text-right">
                  <span className="text-xs text-[var(--color-text-muted)] mr-2">Total:</span>
                  <span className="text-base font-extrabold text-[var(--color-text-primary)]">
                    {order.amounts?.total_amount} <span className="text-xs font-normal">{order.amounts?.currency || 'EGP'}</span>
                  </span>
                </div>
              </div>
            </div>
            
          ))}
        </div>        
      )}

      {selectedOrder && (
        <OrderPaymentsModal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          orderId={selectedOrder.id}
          attempts={selectedOrder.payment?.attempts ?? []}
        />
      )}
    </section>
  );
}