// src/features/managers/dashboard/constants/managerFilters.ts

import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { ManagerFilters } from "../../model/types/manager.types";
import type { Role } from "@/features/roles/model/types/permission.types";

export const getManagerFilters = (
  t: TFunction,
  _lang: string,
  rolesList: Role[] = []
): FilterField<ManagerFilters>[] => [
  {
    key: "status",
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
        label: t("filters.active", "نشط"),
        value: "active",
      },
      {
        label: t("filters.pending", "قيد الانتظار"),
        value: "pending",
      },
      {
        label: t("filters.suspended", "محظور / موقوف"),
        value: "suspended",
      },
    ],
  },
  ...(rolesList.length > 0
    ? [
        {
          key: "role_id" as keyof ManagerFilters,
          label: t("filters.role", "الدور / الصلاحية"),
          type: "select" as const,
          placeholder: t(
            "filters.role_placeholder",
            "اختر الدور"
          ),
          options: [
            {
              label: t("filters.all", "الكل"),
              value: "",
            },
            ...rolesList.map((role) => ({
              label: role.name,
              value: String(role.id),
            })),
          ],
        },
      ]
    : []),
];