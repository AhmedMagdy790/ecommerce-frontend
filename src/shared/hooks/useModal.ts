// src/shared/hooks/useModal.ts
import { useState, useCallback } from "react";

export function useModal<T = any>() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const openCreateModal = useCallback(() => {
    setMode("create");
    setEditingItem(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((item: T) => {
    setMode("edit");
    setEditingItem(item);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setEditingItem(null);
      setMode("create");
    }, 200);
  }, []);

  return {
    mode,
    editingItem,
    isOpen,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}