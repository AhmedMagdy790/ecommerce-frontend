// src/features/cities/hook/useCityActions.ts

import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { useCityStore } from "../../model/store/city.store";

export function useCityActions() {
  const { t } = useTranslation("common");

  const {
    delete: deleteCity,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
    
  } = useCityStore();

  

  const handleDelete = useCallback(
    async (id: number | string) => {
      const result = await confirm({
        title: t("city.delete.title", "حذف المدينة"),
        description: t("city.delete.description", "هل أنت متأكد من حذف هذه المدينة؟"),
        confirmText: t("common.confirm", "تأكيد"),
        cancelText: t("common.cancel", "إلغاء"),
      });

      if (!result || !id) return;

      await deleteCity(id);
    },
    [deleteCity, t]
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