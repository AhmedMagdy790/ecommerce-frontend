import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { useInventoryStore } from "../../model/store/useInvntoryStore";

export function useInventoryActions() {
  const { t } = useTranslation("common");

  const {
    delete: deleteInventory,
  } = useInventoryStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const result = await confirm({
        title: t("inventory.delete.title", "حذف عنصر المخزون"),
        description: t("inventory.delete.description", "هل أنت متأكد من حذف عنصر المخزون هذا؟"),
        confirmText: t("common.confirm", "تأكيد"),
        cancelText: t("common.cancel", "إلغاء"),
      });

      if (!result || !id) return;

      await deleteInventory(id);
    },
    [deleteInventory, t]
  );

  return {
    handleDelete,
  };
}