import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import type { Section } from "../../model/types/section.types";
import type { Column } from "@/shared/components/DataTable/types";
import { Link } from "react-router-dom";
import { ListOrdered, Pencil, Trash2 } from "lucide-react";
import type { TranslatedText } from "@/shared/types/types";

interface GetSectionColumnsProps {
  t: TFunction;
  lang: string;
  togglingId?: number | null;
  onStatusChange?: (id: number, currentStatus: boolean) => void;
  onEdit?: (row: Section<TranslatedText>) => void;
  onDelete?: (row: Section<TranslatedText>) => void;
}

export const getSectionColumns = ({
  t,
  lang,
  togglingId,
  onStatusChange,
  onEdit,
  onDelete,
}: GetSectionColumnsProps): Column<Section<TranslatedText>>[] => [
  {
    header: t("section.name", "Section Name"),
    accessor: (row) => {
      return typeof row.name === "object" && row.name !== null
        ? getLocalizedName(row.name, lang)
        : String(row.name || "");
    },
    className: "font-medium text-[var(--color-text-primary)]",
  },
  {
    header: t("section.key", "Key"),
    accessor: (row) => (
      <span className="bg-[var(--color-background)] px-2 py-1 rounded text-xs border border-[var(--color-border)]">
        {row.key}
      </span>
    ),
  },
  {
    header: t("section.type", "Type"),
    accessor: (row) => (
      <span className="capitalize px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
        {row.type}
      </span>
    ),
  },
  {
    header: t("section.sortOrder", "Sort Order"),
    accessor: (row) => (
      <span className="text-[var(--color-text-secondary)] font-mono">
        {row.sort_order}
      </span>
    ),
  },
  {
    header: t("common.status", "Status"),
    accessor: (row) => {
      const isToggling = togglingId === row.id;
      return (
        <button
          type="button"
          disabled={isToggling}
          onClick={() => onStatusChange?.(row.id, row.is_active)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity ${
            row.is_active
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
          } ${isToggling ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
        >
          {row.is_active ? t("status.active", "Active") : t("status.inactive", "Inactive")}
        </button>
      );
    },
  },
  {
    header: t("common.createdAt", "Created At"),
    accessor: (row) => (
      <span className="text-[var(--color-text-secondary)] text-xs">
        {new Date(row.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: t("common.actions", "Actions"),
    accessor: (row) => (
      <div className="flex items-center gap-1.5">
        {/* زر الانتقال لعناصر القسم (Items) */}
        <Link
          to={`/cms/sections/${row.id}/items`}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors"
          title={lang === "ar" ? "إدارة العناصر" : "Manage Items"}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "العناصر" : "Items"}</span>
        </Link>

        {/* زر التعديل */}
        <button
          type="button"
          onClick={() => onEdit?.(row)}
          className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-alt)] rounded-lg transition-colors"
          title={t("common.edit", "Edit")}
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* زر الحذف */}
        <button
          type="button"
          onClick={() => onDelete?.(row)}
          className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-colors"
          title={t("common.delete", "Delete")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];