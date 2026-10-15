import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { useShippingCourierStore } from "../model/store/shippingCourier.store";

export function useShippingCourierActions(showTrashed?: boolean) {
  const { t } = useTranslation("common");

  const {
    forceDelete,
    delete: deleteCourier,
    restore: restoreCourier,
    isFetchingTrashed,
    fetchTrashedError,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
  } = useShippingCourierStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const isPermanentDelete = showTrashed;

      const result = await confirm({
        title: isPermanentDelete
          ? t("shipping.forceDelete.title", "حذف نهائي لشركة الشحن")
          : t("shipping.delete.title", "حذف شركة الشحن"),

        description: isPermanentDelete
          ? t("shipping.forceDelete.description", "هل أنت متأكد من الحذف النهائي؟ لا يمكن التراجع عن هذا الإجراء.")
          : t("shipping.delete.description", "هل أنت متأكد من نقل شركة الشحن إلى الأرشيف؟"),

        confirmText: t("common.confirm", "تأكيد"),
        cancelText: t("common.cancel", "إلغاء"),
      });

      if (!result || !id) return;

      if (isPermanentDelete) {
        await forceDelete(id);
      } else {
        await deleteCourier(id);
      }
    },
    [showTrashed, forceDelete, deleteCourier, t]
  );

  const handleRestore = useCallback(
    async (id: number | string) => {
      if (!restoreCourier) return;
      await restoreCourier(id);
    },
    [restoreCourier]
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
    fetchTrashedError,
    isToggling,
    toggleError,
    togglingId,
    handleStatusChange,
  };
}