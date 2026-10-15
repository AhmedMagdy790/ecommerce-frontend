// src/pages/categories/constants/CategoryColumns.ts
import type { Column } from "@/shared/components/DataTable/types";
import type { Category } from "../../model/types/category.types";
import type { TranslatedText } from "@/shared/types/types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import { TableCellImage } from "@/shared/components/DataTable/TableCellImage";

interface GetCategoryColumnsProps {
  t: TFunction;
  lang: string;
  showTrashed?: boolean;
  togglingId?: number | string | null;
  onStatusChange?: (id: number | string, status: string) => void;
}

export function getCategoryColumns({
  t,
  lang,
  showTrashed,
  togglingId,
  onStatusChange,
}: GetCategoryColumnsProps): Column<Category<TranslatedText>>[] {
  return [
    {
      id: "name",
      header: t("category.name", "Category Name"),
      accessor: (row) => getLocalizedName(row.name, lang),
    },
    {
      id: "image",
      header: t("category.image", "Image"),
      accessor: (row) => row.image,
      render: (_value, row) => (
        <TableCellImage
          src={row.image} 
          alt={getLocalizedName(row.name, lang)} 
          rounded="full"
        />
      ),
    },
    {
      id: "parent",
      header: t("category.parent", "Parent Category"),
      accessor: (row) => getLocalizedName(row?.parent?.name, lang),
    },
    {
      id: "slug",
      header: t("category.slug", "Slug"),
      accessor: "slug",
    },
    {
      id: "status",
      header: t("common.status", "Status"),
      accessor: "status",
      render: (value, row) => {
        const isActive = value === "active";

        const isLoadingThis =  togglingId === row.id;

        return (
          <button
            type="button"
            disabled={showTrashed || isLoadingThis}
            onClick={() => {
              if (showTrashed || isLoadingThis || !onStatusChange) return;
              const newStatus = isActive ? "inactive" : "active";
              onStatusChange(row.id, newStatus);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
              showTrashed || isLoadingThis
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:opacity-80"
            } ${
              isActive
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20"
            }`}
            title={!showTrashed ? t("status.toggle", "Click to change status") : undefined}
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
  ];
}