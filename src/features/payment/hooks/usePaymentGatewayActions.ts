// src/features/payment/dashboard/hooks/usePaymentGatewayActions.ts

import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { usePaymentGatewayStore } from "../model/store/paymentGateway.store";

export function usePaymentGatewayActions(showTrashed?: boolean) {
  const { t } = useTranslation("common");

  const {
    forceDelete,
    delete: deleteGateway,
    restore: restoreGateway,
    isFetchingTrashed,
    trashActionError,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
  } = usePaymentGatewayStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const isPermanentDelete = showTrashed;

      const result = await confirm({
        title: isPermanentDelete
          ? t("payment.forceDelete.title", "حذف بوابة الدفع نهائياً")
          : t("payment.delete.title", "نقل بوابة الدفع إلى سلة المهملات"),

        description: isPermanentDelete
          ? t("payment.forceDelete.description", "هل أنت متأكد من الحذف النهائي؟ لا يمكن التراجع عن هذا الإجراء.")
          : t("payment.delete.description", "هل أنت متأكد من نقل هذه البوابة إلى سلة المهملات؟"),

        confirmText: t("common.confirm", "تأكيد"),
        cancelText: t("common.cancel", "إلغاء"),
      });

      if (!result || !id) return;

      if (isPermanentDelete) {
        await forceDelete(id);
      } else {
        await deleteGateway(id);
      }
    },
    [showTrashed, forceDelete, deleteGateway, t]
  );

  const handleRestore = useCallback(
    async (id: number | string) => {
      if (!restoreGateway) return;
      await restoreGateway(id);
    },
    [restoreGateway]
  );

  const handleStatusChange = useCallback(
    async (id: number | string) => {
      await toggleStatus(id);
    },
    [toggleStatus]
  );

  return {
    handleDelete,
    handleRestore,
    isFetchingTrashed,
    trashActionError,
    isToggling,
    toggleError,
    togglingId,
    handleStatusChange,
  };
}