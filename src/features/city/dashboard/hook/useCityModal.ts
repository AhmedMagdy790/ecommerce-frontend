// src/features/cities/hook/useCityModal.ts
import { useState, useCallback } from "react";
import type { City } from "../../model/types/city.types";
import type { TranslatedText } from "@/shared/types/types";


export function useCityModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingCity, setEditingCity] = useState<City<TranslatedText> | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const openCreateModal = useCallback(() => {
    setMode("create");
    setEditingCity(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((city: City<TranslatedText>) => {
    setMode("edit");
    setEditingCity(city);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);

    setTimeout(() => {
      setEditingCity(null);
      setMode("create");
    }, 200);
  }, []);

  return {
    mode,
    editingCity,
    isModalOpen: isOpen,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}