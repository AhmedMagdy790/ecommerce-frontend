// src/features/countries/hooks/useCountryActions.ts

import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useCountryStore } from "../model/store/useCountryStore";
import { useTranslation } from "react-i18next";

export function useCountryActions() {
  const { t } = useTranslation("common");

  const {
    delete: deleteCountry,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
  } = useCountryStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const result = await confirm({
        title: t("countries.delete.title", "Delete Country"),
        description: t("countries.delete.description", "Are you sure you want to delete this country? This action cannot be undone."),
        confirmText: t("common.confirm", "Confirm"),
        cancelText: t("common.cancel", "Cancel"),
      });

      if (!result || !id) return;

      await deleteCountry(id);
    },
    [deleteCountry, t]
  );

  const handleStatusChange = useCallback(
    async (id: number | string) => {
      await toggleStatus(id);
    },
    [toggleStatus]
  );

  return {
    handleDelete,
    handleStatusChange,
    isToggling,
    toggleError,
    togglingId,
  };
}