// src/features/shipping/hooks/useShippingRateActions.ts

import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useTranslation } from "react-i18next";
import { useShippingRateStore } from "../model/store/shippingRate.store";

export function useShippingRateActions() {
  const { t } = useTranslation("common");

  const {
    delete: deleteRate,
    toggleStatus,
    isToggling,
    toggleError,
    togglingId,
  } = useShippingRateStore();

  const handleDelete = useCallback(
    async (id: number | string) => {
      const result = await confirm({
        title: t("shipping.rateDelete.title", "حذف سعر الشحن"),
        description: t(
          "shipping.rateDelete.description",
          "هل أنت متأكد من حذف سعر الشحن هذا؟ لا يمكن التراجع عن هذا الإجراء."
        ),
        confirmText: t("common.confirm", "تأكيد"),
        cancelText: t("common.cancel", "إلغاء"),
      });

      if (!result || !id) return;

      await deleteRate(id);
    },
    [deleteRate, t]
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