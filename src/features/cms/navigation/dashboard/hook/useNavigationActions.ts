import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { useNavigationStore } from "../../model/store/navigationStore";

export function useNavigationActions() {
  const { t } = useTranslation("common");

  const {
    delete: deleteMenu,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
  } = useNavigationStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const result = await confirm({
        title: t("navigation.delete.title", "حذف القائمة"),
        description: t("navigation.delete.description", "هل أنت متأكد من رغبتك في حذف هذه القائمة؟ لن يمكنك التراجع عن هذا الإجراء."),
        confirmText: t("common.confirm", "تأكيد"),
        cancelText: t("common.cancel", "إلغاء"),
      });

      if (!result || !id) return;

      await deleteMenu(id);
    },
    [deleteMenu, t]
  );

  const handleStatusChange = useCallback(
    async (id: number | string, newStatus: boolean) => {
      await toggleStatus(id);
      void newStatus;
    },
    [toggleStatus]
  );

  return {
    handleDelete,
    isToggling,
    toggleError,
    togglingId,
    handleStatusChange,
  };
}