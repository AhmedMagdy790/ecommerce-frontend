import { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSectionItemStore } from "../../model/store/useSectionItemStore";
import type { SectionItem } from "../../model/types/sectionItem.types";
import type { SectionFilters } from "../../model/types/section.types";
import type { FilterField } from "@/shared/components/DataTable/FiltterDataTable";

export function useSectionItemPage(sectionId?: string | number) {
  const { t } = useTranslation("cms");

  const items = useSectionItemStore((state) => state.items);
  const pagination = useSectionItemStore((state) => state.pagination);
  // const fetchItems = useSectionItemStore((state) => state.fetch);
  const getBySection = useSectionItemStore((state) => state.getBySection);
  const deleteItem = useSectionItemStore((state) => state.delete);
  const setFilters = useSectionItemStore((state) => state.setFilters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSectionItem, setEditingSectionItem] = useState<SectionItem | null>(null);

  useEffect(() => {
    if (sectionId) {
      getBySection(sectionId);
    }
  }, [sectionId, getBySection]);

  const openCreateModal = useCallback(() => {
    setEditingSectionItem(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: SectionItem) => {

    setEditingSectionItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingSectionItem(null);
    setIsModalOpen(false);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteItem(id);
    },
    [deleteItem]
  );

  const handleServerFilterOrPageChange = useCallback(
    (params: Record<string, unknown>) => {
      setFilters({
        ...params,
        section_id: sectionId,
      });
    },
    [setFilters, sectionId]
  );

  const sectionItemFilters = useMemo(
    (): FilterField<SectionFilters>[] => [
      {
        key: "search",
        label: "search",
        type: "text" as const,
        placeholder: t("sectionItem.searchPlaceholder", "Search items by title..."),
      },
    ],
    [t]
  );

  return {
    currentData: items,
    pagination,
    handleServerFilterOrPageChange,
    sectionItemFilters,

    isModalOpen,
    editingSectionItem,
    openCreateModal,
    openEditModal,
    closeModal,

    handleDelete,
  };
}