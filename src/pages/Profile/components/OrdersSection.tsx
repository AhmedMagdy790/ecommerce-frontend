import React from "react";
import { useTranslation } from "react-i18next";
import { useOrders } from "../hooks/useOrders"; // استيراد الهوك الجديد

export default function OrdersSection() {
  const { t } = useTranslation("profile");
  const { orders, isLoading, isError } = useOrders(); // جلب البيانات

  return (
    <section className="bg-[var(--color-surface)] p-[var(--spacing-8)] rounded-[var(--radius-2xl)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      <h2 className="text-[var(--text-xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] mb-[var(--spacing-2)]">
        {t("sections.orders.title")}
      </h2>
      <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-[var(--spacing-6)]">
        {t("sections.orders.description")}
      </p>

      {/* 1. حالة التحميل */}
      {isLoading && (
        <div className="text-center py-12 text-[var(--color-text-muted)] text-sm">
          Loading orders...
        </div>
      )}

      {/* 2. حالة وجود خطأ */}
      {isError && (
        <div className="text-center py-12 text-red-500 text-sm">
          Failed to load orders. Please try again later.
        </div>
      )}

      {/* 3. إذا لم تكن هناك طلبات (القائمة فارغة) */}
      {!isLoading && !isError && orders.length === 0 && (
        <div className="text-center py-[var(--spacing-12)] text-[var(--color-text-muted)] text-[var(--text-sm)]">
          {t("sections.orders.empty")}
        </div>
      )}

      {/* 4. عرض قائمة الطلبات الحقيقية */}
      {!isLoading && !isError && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-[var(--color-text-primary)]">Order #{order.id}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">{order.created_at}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[var(--color-text-primary)]">{order.total} EGP</p>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}