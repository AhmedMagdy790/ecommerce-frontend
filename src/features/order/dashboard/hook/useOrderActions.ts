// src/features/order/hooks/useOrderActions.ts
import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { useOrderStore } from "../../model/store/order.store";
import type { OrderStatus } from "../../model/types/order.types";


export function useOrderActions(showTrashed?: boolean) {
  const { t } = useTranslation("common");

  const {
    forceDelete,
    delete: deleteOrder,
    restore: restoreOrder,
    updateOrderStatus,
    isFetchingTrashed,
    trashActionError,
    isToggling,
    toggleError,
    togglingId,
  } = useOrderStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const isPermanentDelete = showTrashed;

      const result = await confirm({
        title: isPermanentDelete
          ? t("order.forceDelete.title", "Permanent Delete Order")
          : t("order.delete.title", "Delete Order"),

        description: isPermanentDelete
          ? t("order.forceDelete.description", "Are you sure you want to permanently delete this order? This action cannot be undone.")
          : t("order.delete.description", "Are you sure you want to move this order to trash?"),

        confirmText: t("common.confirm", "Confirm"),
        cancelText: t("common.cancel", "Cancel"),
      });

      if (!result || !id) return;

      if (isPermanentDelete) {
        await forceDelete(id);
      } else {
        await deleteOrder(id);
      }
    },
    [showTrashed, forceDelete, deleteOrder, t]
  );

  const handleRestore = useCallback(
    async (id: number | string) => {
      if (!restoreOrder) return;
      await restoreOrder(id);
    },
    [restoreOrder]
  );

  const handleStatusChange = useCallback(
    async (id: number | string, status: OrderStatus) => {
      await updateOrderStatus(id, status);
    },
    [updateOrderStatus]
  );

  return {
    handleDelete,
    handleRestore,
    handleStatusChange,
    isFetchingTrashed,
    trashActionError,
    isToggling,
    toggleError,
    togglingId,
  };
}