import type { Column } from "@/shared/components/DataTable/types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import { Layers } from "lucide-react";
import { Link } from "react-router-dom";
import type { Page } from "../../model/types/page.types";
import type { TranslatedText } from "@/shared/types/types";

interface GetPageColumnsProps {
  t: TFunction;
  lang: string;
  togglingId?: number | string | null;
  onStatusChange?: (id: number | string, status: boolean) => void;
}

export function getPageColumns({
  t,
  lang,
  togglingId,
  onStatusChange,
}: GetPageColumnsProps): Column<Page<TranslatedText>>[] {
  return [
    {
      id: "title",
      header: t("page.title", "Page Title"),
      accessor: (row) => getLocalizedName(row.title, lang),
    },
    {
      id: "slug",
      header: t("page.slug", "Slug"),
      accessor: "slug",
    },
    {
      id: "is_active",
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
      id: "created_at",
      header: t("common.created_at", "Created At"),
      accessor: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      id: "builder",
      header: t("page.builder", "Page Builder"),
      accessor: (row) => row.id,
      render: (_, row) => (
        <Link
          to={`/admin/cms/pages/${row.id}/builder`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
        >
          <Layers size={14} />
          <span>{t("page.buildPage", "Build Page")}</span>
        </Link>
      ),
    },
  ];
}