// src/features/users/dashboard/constants/userFilters.ts

import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import type { TFunction } from "i18next";
import type { UserFilters } from "../../model/types/user.types";

export const getUserFilters = (
  t: TFunction,
): FilterField<UserFilters>[] => [
  {
    key: "status", // أو أي حقل تصفية معتمد في الـ Backend
    label: t("filters.status", "الحالة"),
    type: "select",
    placeholder: t("filters.status_placeholder", "تصفية حسب الحالة"),
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
        label: t("filters.inactive", "غير نشط"),
        value: "inactive",
      },
    ],
  },
  {
    key: "role",
    label: t("filters.role", "الصلاحية"),
    type: "select",
    placeholder: t("filters.role_placeholder", "تصفية حسب الصلاحية"),
    options: [
      {
        label: t("filters.all", "الكل"),
        value: "",
      },
      {
        label: t("roles.admin", "مشرف"),
        value: "admin",
      },
      {
        label: t("roles.user", "مستخدم"),
        value: "user",
      },
    ],
  },
];