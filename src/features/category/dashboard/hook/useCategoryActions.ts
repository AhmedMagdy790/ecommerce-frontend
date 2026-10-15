import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useCategoryStore } from "../../model/store/useCategoryStore";
import { useTranslation } from "react-i18next";

export function useCategoryActions(showTrashed?: boolean) {
  const { t } = useTranslation("common");

  const {
    forceDelete,
    delete: deleteCategory,
    restore: restoreCategory,
    isFetchingTrashed,
    trashActionError,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
  } = useCategoryStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const isPermanentDelete = showTrashed;


      const result = await confirm({
        title: isPermanentDelete
          ? t("category.forceDelete.title")
          : t("category.delete.title"),

        description: isPermanentDelete
          ? t("category.forceDelete.description")
          : t("category.delete.description"),

        confirmText: t("common.confirm"),
        cancelText: t("common.cancel"),
      });

      if (!result || !id) return;

      if (isPermanentDelete) {
        await forceDelete(id);
      } else {
        await deleteCategory(id);
      }
    },
    [showTrashed, forceDelete, deleteCategory, t]
  );


  const handleRestore = useCallback(
    async (id: number | string) => {
      if (!restoreCategory) return;
      await restoreCategory(id);
    },
    [restoreCategory]
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
    handleStatusChange
  };
}