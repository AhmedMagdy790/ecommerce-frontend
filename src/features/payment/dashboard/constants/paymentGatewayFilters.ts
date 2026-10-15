// src/features/payment/dashboard/constants/paymentGatewayFilters.ts
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { PaymentGatewayFilters } from "../../model/types/payment.types";

export const getPaymentGatewayFilters = (
  t: TFunction
): FilterField<PaymentGatewayFilters>[] => [
  {
    key: "is_active",
    label: t("filters.status", "الحالة"),
    type: "select",
    placeholder: t(
      "filters.status_placeholder",
      "تصفية حسب الحالة"
    ),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      {
        label: t("status.active", "نشط"),
        value: "1",
      },
      {
        label: t("status.inactive", "غير نشط"),
        value: "0",
      },
    ],
  },
  {
    key: "is_test_mode",
    label: t("payment.testMode", "وضع الاختبار"),
    type: "select",
    placeholder: t(
      "payment.selectTestModeFilter",
      "تصفية حسب وضع الاختبار"
    ),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      {
        label: t("common.yes", "نعم"),
        value: "1",
      },
      {
        label: t("common.no", "لا"),
        value: "0",
      },
    ],
  },
];