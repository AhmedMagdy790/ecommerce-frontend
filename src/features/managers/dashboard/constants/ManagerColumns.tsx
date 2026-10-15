// src/features/managers/dashboard/constants/getManagerColumns.ts

import type { Column } from "@/shared/components/DataTable/types";
import type { User, UserStatus } from "@/features/users/model/types/user.types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import { TableCellImage } from "@/shared/components/DataTable/TableCellImage";

interface GetManagerColumnsProps {
  t: TFunction;
  lang: string;
  onOpenStatusModal?: (user: User) => void;
}

export function getManagerColumns({
  t,
  lang,
  onOpenStatusModal,
}: GetManagerColumnsProps): Column<User>[] {
  return [
    {
      id: "name",
      header: t("managers.name", "اسم المشرف"),
      accessor: (row) => getLocalizedName(row.name, lang),
    },
    {
      id: "avatar",
      header: t("managers.avatar", "الصورة الشخصية"),
      accessor: (row) => row.avatar,
      render: (_, row) => (
        <TableCellImage
          src={row.avatar}
          alt={getLocalizedName(row.name, lang)}
          rounded="full"
        />
      ),
    },
    {
      id: "email",
      header: t("common.email", "البريد الإلكتروني"),
      accessor: "email",
    },
    {
      id: "phone",
      header: t("common.phone", "رقم الهاتف"),
      accessor: (row) => row.phone || "-",
    },
    {
      id: "roles",
      header: t("managers.roles", "الأدوار والصلاحيات"),
      accessor: (row) => {
        if (!row.roles || row.roles.length === 0) return "-";
        return row.roles
          .map((role) => (typeof role === "object" ? getLocalizedName(role.name, lang) : role))
          .join(", ");
      },
      render: (_, row) => {
        if (!row.roles || row.roles.length === 0) {
          return <span className="text-xs text-[var(--color-text-muted)]">-</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {row.roles.map((role, idx) => {
              const roleName =
                typeof role === "object" ? getLocalizedName(role.name, lang) : String(role);

              return (
                <span
                  key={typeof role === "object" && role.id ? role.id : idx}
                  className="px-2 py-0.5 text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-[var(--radius-sm)]"
                >
                  {roleName}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "status",
      header: t("common.status", "الحالة"),
      accessor: "status",
      render: (value, row) => {
        const currentStatus = (value as UserStatus) || "pending";

        const getStatusBadge = (status: UserStatus) => {
          switch (status) {
            case "active":
              return {
                label: t("status.active", "نشط"),
                className: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
              };
            case "suspended":
              return {
                label: t("status.suspended", "معلق / محظور"),
                className: "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20",
              };
            case "pending":
            default:
              return {
                label: t("status.pending", "قيد الانتظار"),
                className: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
              };
          }
        };

        const badge = getStatusBadge(currentStatus);

        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenStatusModal?.(row);
            }}
            className={`px-2.5 py-1 text-xs font-medium border rounded-full transition-all cursor-pointer hover:scale-105 ${badge.className}`}
          >
            {badge.label}
          </button>
        );
      },
    },
  ];
}