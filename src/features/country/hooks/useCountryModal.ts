import { useState, useCallback } from "react";
import type { Country } from "../model/types/country.types";
import type { TranslatedText } from "@/shared/types/types";

export function useCountryModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingCountry, setEditingCountry] = useState<Country<TranslatedText> | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const openCreateModal = useCallback(() => {
    setMode("create");
    setEditingCountry(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((country: Country<TranslatedText>) => {
    setMode("edit");
    setEditingCountry(country);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setEditingCountry(null);
      setMode("create");
    }, 200);
  }, []);

  return {
    mode,
    editingCountry,
    isOpen,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}