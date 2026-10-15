import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { usePageStore } from "../../model/store/usePageStore";

export function usePageActions() {
  const { t } = useTranslation("common");

  const {
    delete: deletePage,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
  } = usePageStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const result = await confirm({
        title: t("page.delete.title", "Delete Page"),
        description: t("page.delete.description", "Are you sure you want to delete this page?"),
        confirmText: t("common.confirm", "Confirm"),
        cancelText: t("common.cancel", "Cancel"),
      });

      if (!result || !id) return;

      await deletePage(id);
    },
    [deletePage, t]
  );

  const handleStatusChange = useCallback(
    async (id: number | string) => {
      await toggleStatus(id);
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