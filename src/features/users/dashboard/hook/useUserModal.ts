// src/features/users/dashboard/hook/useUserModal.ts
import { useState } from "react";
import type { User } from "../../model/types/user.types";

export function useUserModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    editingUser,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}