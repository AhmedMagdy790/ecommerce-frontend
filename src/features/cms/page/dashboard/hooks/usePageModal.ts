import { useState, useCallback } from "react";
import type { Page } from "../../model/types/page.types";


export function usePageModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  // فتح الـ Modal للإضافة
  const openCreateModal = useCallback(() => {
    setMode("create");
    setEditingPage(null);
    setIsOpen(true);
  }, []);

  // فتح الـ Modal للتعديل
  const openEditModal = useCallback((page: Page) => {
    setMode("edit");
    setEditingPage(page);
    setIsOpen(true);
  }, []);

  // إغلاق الـ Modal
  const closeModal = useCallback(() => {
    setIsOpen(false);

    setTimeout(() => {
      setEditingPage(null);
      setMode("create");
    }, 200);
  }, []);

  return {
    mode,
    editingPage,
    isModalOpen: isOpen,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}