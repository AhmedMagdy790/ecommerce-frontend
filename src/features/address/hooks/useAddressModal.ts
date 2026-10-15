import { useState, useCallback } from "react";
import type { Address } from "../model/types/address.types";

export function useAddressModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

  const openCreateModal = useCallback(() => {
    setMode("create");
    setEditingAddress(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((address: Address) => {
    setMode("edit");
    setEditingAddress(address);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);

    setTimeout(() => {
      setEditingAddress(null);
      setMode("create");
    }, 200);
  }, []);

  return {
    mode,
    editingAddress,
    isModalOpen: isOpen,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}