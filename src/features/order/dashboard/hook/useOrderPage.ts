// src/features/order/hook/useOrderPage.ts

import { useOrderTable } from "./useOrderTable";
import { useOrderActions } from "./useOrderActions";
import { useModal } from "@/shared/hooks/useModal";
import type { Order } from "../../model/types/order.types";
import type { TranslatedText } from "@/shared/types/types";


export function useOrderPage() {
  const table = useOrderTable();
  const actions = useOrderActions(table.showTrashed);

  // 1. مودال التفاصيل العام
  const detailsModal = useModal<Order>();

  // 2. مودال تغيير الحالة
  const statusModal = useModal<Order<TranslatedText>>();

  return {
    ...table,
    ...actions,

    // 🟢 أسماء مودال التفاصيل المتطابقة مع OrderPage.tsx
    isDetailsModalOpen: detailsModal.isOpen,
    selectedOrderForDetails: detailsModal.editingItem,
    openDetailsModal: detailsModal.openEditModal,
    closeDetailsModal: detailsModal.closeModal,

    // 🟢 أسماء مودال تغيير الحالة
    isStatusModalOpen: statusModal.isOpen,
    selectedOrder: statusModal.editingItem,
    openStatusModal: statusModal.openEditModal,
    closeStatusModal: statusModal.closeModal,
  };
}