// src/features/order/dashboard/components/OrderPage.tsx

import { useCallback, useMemo } from "react";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import DataTable from "@/shared/components/DataTable/DataTable";
import { Button } from "@/shared/components/Button";

import type { Order } from "../../model/types/order.types";

import { getOrderColumns } from "../constants/OrderColumns";
import { useOrderPage } from "../hook/useOrderPage";
import { OrderStats } from "../components/OrderStats";
import { useLang } from "@/shared/context/LanguageContext";
import OrderModal from "../components/OrderModal";
import OrderStatusModal from "../components/OrderStatusModal";
import type { TranslatedText } from "@/shared/types/types";

export default function OrderPage() {
  const { t } = useTranslation("order");
  const { lang } = useLang();

  const {
    currentData,
    status,
    isLoading,
    pagination,
    showTrashed,
    setShowTrashed,
    handleServerFilterOrPageChange,

    orderFilters,

    // مودال تغيير الحالة
    isStatusModalOpen,
    selectedOrder,
    openStatusModal,
    closeStatusModal,

    // مودال التفاصيل العام
    isDetailsModalOpen,
    selectedOrderForDetails,
    closeDetailsModal,

    handleDelete,
    handleRestore
  } = useOrderPage();

  const handleDeleteRow = useCallback(
    (item: Order) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getOrderColumns(t, lang, openStatusModal),
    [
      t,
      lang,
      openStatusModal
    ]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardListIcon className="w-6 h-6 text-[var(--color-primary)]" />

          <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)]">
            {t("page.title", "Order Management")}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={showTrashed ? "outline" : "secondary"}
            onClick={() => setShowTrashed(!showTrashed)}
          >
            {showTrashed
              ? t("actions.viewActive", "View Active")
              : t("actions.viewTrashed", "View Trashed")}
          </Button>

          {!showTrashed && (
            <Button
              onClick={() => {
                // navigate("/admin/orders/create")
              }}
              className="flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />

              <span>
                {t("actions.create", "Create Order")}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <OrderStats
        stats={status}
      />

      {/* Table */}
      <DataTable<Order<TranslatedText>>
        data={currentData}
        loading={isLoading}
        showTrashed={showTrashed}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={orderFilters}
        onDelete={handleDeleteRow}
        onRestore={(item) => handleRestore(item.id)}
      />


      {selectedOrderForDetails && (
        <OrderModal
          isOpen={isDetailsModalOpen}
          closeModal={closeDetailsModal}
          order={selectedOrderForDetails}
        />
      )}

      {/* 2. مودال تغيير الحالة */}
      <OrderStatusModal
        isOpen={isStatusModalOpen}
        closeModal={closeStatusModal}
        order={selectedOrder}
      />
    </div>
  );
}