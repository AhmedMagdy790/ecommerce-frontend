import { useState, useCallback, useMemo } from "react";
// import { useSectionStore } from "../model/store/useSectionStore";
// import type { Section } from "../model/types/section.types";
import { useTranslation } from "react-i18next";
import { useSectionStore } from "../../model/store/useSectionStore";
import type { Section } from "../../model/types/section.types";
import { getSectionFilters } from "../constants/sectionFilters";

export function useSectionPage() {
  const { t } = useTranslation("cms");

  const items = useSectionStore((state) => state.items);
  const pagination = useSectionStore((state) => state.pagination);
  const deleteItem = useSectionStore((state) => state.delete);
  const toggleStatus = useSectionStore((state) => state.toggleStatus);
  const setFilters = useSectionStore((state) => state.setFilters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const openCreateModal = useCallback(() => {
    setEditingSection(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((section: Section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditingSection(null);
    setIsModalOpen(false);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteItem(id);
    },
    [deleteItem]
  );

  const handleStatusChange = useCallback(
    async (id: number) => {
      setTogglingId(id);
      try {
        await toggleStatus(id);
      } finally {
        setTogglingId(null);
      }
    },
    [toggleStatus]
  );

  const handleServerFilterOrPageChange = useCallback(
    (params: Record<string, unknown>) => {
      setFilters(params);
    },
    [setFilters]
  );

  const sectionFilters = useMemo(
    () => getSectionFilters(t,""),
    [t]
  );

  return {
    currentData: items,
    pagination,
    handleServerFilterOrPageChange,
    sectionFilters,

    isModalOpen,
    editingSection,
    openCreateModal,
    openEditModal,
    closeModal,

    handleDelete,
    handleStatusChange,
    togglingId,
  };
}