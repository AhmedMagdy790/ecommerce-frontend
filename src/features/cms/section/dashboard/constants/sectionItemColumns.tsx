import { getLocalizedName } from "@/shared/utils/localizeName";
import type { TFunction } from "i18next";
import type { SectionItem } from "../../model/types/sectionItem.types";
import type { Column } from "@/shared/components/DataTable/types";
import type { TranslatedText } from "@/shared/types/types";

interface GetSectionItemColumnsProps {
  t: TFunction;
  lang: string;
}

export const getSectionItemColumns = ({
  t,
  lang,
}: GetSectionItemColumnsProps): Column<SectionItem<TranslatedText>>[] => [
  {
    header: t("sectionItem.image", "Image"),
    accessor: (row) =>
      row.image ? (
        <img
          src={row.image}
          alt="Item"
          className="w-10 h-10 object-cover rounded-md border border-[var(--color-border)] shadow-sm"
        />
      ) : (
        <span className="text-xs text-[var(--color-text-secondary)] italic">
          {t("common.noImage", "No Image")}
        </span>
      ),
  },
  {
    header: t("sectionItem.title", "Title"),
    accessor: (row) => {
      return row.title && typeof row.title === "object"
        ? getLocalizedName(row.title, lang)
        : String(row.title || "-");
    },
    className: "font-medium text-[var(--color-text-primary)]",
  },
  {
    header: t("sectionItem.link", "Link"),
    accessor: (row) =>
      row.link ? (
        <a
          href={row.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--color-primary)] hover:underline truncate max-w-[200px] block"
        >
          {row.link}
        </a>
      ) : (
        <span className="text-xs text-[var(--color-text-secondary)]">-</span>
      ),
  },
  {
    header: t("sectionItem.product", "Linked Product"),
    accessor: (row) =>
      row.product ? (
        <span className="text-xs font-medium text-[var(--color-text-primary)]">
          {getLocalizedName(row?.product?.name, lang)}
        </span>
      ) : (
        <span className="text-xs text-[var(--color-text-secondary)]">-</span>
      ),
  },
  {
    header: t("sectionItem.sortOrder", "Sort Order"),
    accessor: (row) => (
      <span className="text-[var(--color-text-secondary)] font-mono">
        {row.sort_order}
      </span>
    ),
  },
  {
    header: t("common.createdAt", "Created At"),
    accessor: (row) => (
      <span className="text-[var(--color-text-secondary)] text-xs">
        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}
      </span>
    ),
  },
];