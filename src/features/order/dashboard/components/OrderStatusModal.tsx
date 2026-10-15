// src/features/order/dashboard/components/OrderStatusModal.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import BaseModel from "@/shared/components/BaseModal";
import CustomSelect from "@/shared/components/CustomSelect";
import type { IModal, TranslatedText } from "@/shared/types/types";
import type { Order, OrderStatus } from "../../model/types/order.types";
import { useOrderPage } from "../hook/useOrderPage";

interface IOrderStatusModal extends IModal {
  order?: Order<TranslatedText> | null;
}

export default function OrderStatusModal({ isOpen, closeModal, order }: IOrderStatusModal) {
  const { t } = useTranslation();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status ?? "pending");

  const {
    handleStatusChange,
    isLoading
  } = useOrderPage();

  const statusOptions = useMemo(() => [
    { label: `⏳ ${t("order_status.pending", "Pending")}`, value: "pending" },
    { label: `🔄 ${t("order_status.processing", "Processing")}`, value: "processing" },
    { label: `🚚 ${t("order_status.shipped", "Shipped")}`, value: "shipped" },
    { label: `✅ ${t("order_status.completed", "Completed")}`, value: "completed" },
    { label: `❌ ${t("order_status.cancelled", "Cancelled")}`, value: "cancelled" },
    { label: `↩️ ${t("order_status.returned", "Returned")}`, value: "returned" },
  ], [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !order.id || !selectedStatus || selectedStatus === order.status) {
      closeModal();
      return;
    }

    console.log("order", order)
    console.log("selectedStatus", selectedStatus)

    await handleStatusChange(order.id, selectedStatus);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isLoading}
      closeModal={closeModal}
      action={
        <div className="flex gap-2 justify-end w-full">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button
            type="button"
            disabled={isLoading || !order}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? t("common.saving", "Saving...") : t("common.save", "Save Changes")}
          </button>
        </div>
      }
      title={t("order.updateStatusTitle", "Update Order Status")}
      description={`${t("order.orderNumber", "Order Number")}: ${order?.order_number ?? ""}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="py-3 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("order.columns.status", "Status")}
          </label>
          <CustomSelect
            disabled={isLoading || !order}
            placeholder={t("order.selectStatus", "Select status...")}
            options={statusOptions}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val as OrderStatus)}
          />
        </div>
      </form>
    </BaseModel>
  );
}