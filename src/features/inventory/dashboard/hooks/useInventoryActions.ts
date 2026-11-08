import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { useInventoryStore } from "../../model/store/useInvntoryStore";

export function useInventoryActions() {
  const { t } = useTranslation("inventory");
  const { t: tc } = useTranslation("common");

  const {
    delete: deleteInventory,
  } = useInventoryStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const result = await confirm({
        title: t("delete.title", "حذف عنصر المخزون"),
        description: t("delete.description", "هل أنت متأكد من حذف عنصر المخزون هذا؟"),
        confirmText: tc("confirm", "تأكيد"),
        cancelText: tc("cancel", "إلغاء"),
      });

      if (!result || !id) return;

      await deleteInventory(id);
    },
    [deleteInventory, t, tc]
  );

  return {
    handleDelete,
  };
}