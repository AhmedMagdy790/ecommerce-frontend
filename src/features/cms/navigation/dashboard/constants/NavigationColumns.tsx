import type { Column } from "@/shared/components/DataTable/types";
import type { TFunction } from "i18next";
import { FolderTreeIcon } from "lucide-react";
import type { NavMenu } from "../../model/types/navigation.types";
import { getLocalizedName } from "@/shared/utils/localizeName";

interface GetNavigationColumnsProps {
  t: TFunction;
  lang: string;
  togglingId?: number | string | null;
  onStatusChange?: (id: number | string, status: boolean) => void;
  onManageItems?: (menu: NavMenu) => void;
}

export function getNavigationColumns({
  t,
  lang,
  togglingId,
  onStatusChange,
  onManageItems,
}: GetNavigationColumnsProps): Column<NavMenu>[] {
  return [
    {
      id: "name",
      header: t("navigation.name", "Menu Name"),
      accessor: (row) => getLocalizedName(row.name, lang)
    },
    {
      id: "location",
      header: t("navigation.location", "Location Key"),
      accessor: "location",
      render: (value) => (
        <span className="px-2.5 py-1 rounded-md bg-[var(--color-background-secondary)] text-xs font-mono font-medium text-[var(--color-text-secondary)]">
          {String(value)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("common.status", "Status"),
      accessor: "is_active",
      render: (value, row) => {
        const isActive = Boolean(value);
        const isLoadingThis = togglingId === row.id;

        return (
          <button
            type="button"
            disabled={isLoadingThis}
            onClick={() => {
              if (isLoadingThis || !onStatusChange) return;
              onStatusChange(row.id, !isActive);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              isLoadingThis
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:opacity-80"
            } ${
              isActive
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20"
            }`}
            title={t("status.toggle", "Click to change status")}
          >
            {isLoadingThis && (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            <span>
              {isActive
                ? t("status.active", "Active")
                : t("status.inactive", "Inactive")}
            </span>
          </button>
        );
      },
    },
    {
      id: "manage_items",
      header: t("navigation.items", "Menu Structure"),
      accessor: "id",
      render: (_, row) => (
        <button
          type="button"
          onClick={() => onManageItems?.(row)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 text-xs font-medium transition-colors"
        >
          <FolderTreeIcon className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "إدارة العناصر الهرمية" : "Manage Items"}</span>
        </button>
      ),
    },
  ];
}