// src/features/managers/dashboard/hooks/useMangerPage.ts

import { useCallback } from "react";
import { useModal } from "@/shared/hooks/useModal";
import { useManagerActions } from "./useManagerActions";
import type { User, UserStatus } from "@/features/users/model/types/user.types";
import type { EntityId } from "@/shared/types/entity";
import { useManagerTable } from "./useManagerTable.ts";

export function useMangerPage() {
  const table = useManagerTable();
  const actions = useManagerActions();

  // مودال الإضافة والتعديل الرئيسي
  const mainModal = useModal<User>();

  // مودال تغيير الحالة المخصص
  const statusModal = useModal<User>();

  // دالة فتح مودال تغيير الحالة
  const openStatusModal = useCallback(
    (user: User) => statusModal.openEditModal(user),
    [statusModal]
  );

  // دالة تأكيد تغيير الحالة ثم الإغلاق
  const confirmStatusChange = useCallback(
    async (id: EntityId, status: UserStatus) => {
      await actions.handleStatusChange(id, status);
      statusModal.closeModal();
    },
    [actions, statusModal]
  );

  return {
    ...table,
    ...actions,

    // Main Manager Modal
    isOpen: mainModal.isOpen,
    editingItem: mainModal.editingItem,
    openCreateModal: mainModal.openCreateModal,
    openEditModal: mainModal.openEditModal,
    closeModal: mainModal.closeModal,

    // Status Modal
    isStatusModalOpen: statusModal.isOpen,
    selectedUserForStatus: statusModal.editingItem,
    openStatusModal,
    closeStatusModal: statusModal.closeModal,
    confirmStatusChange,
  };
}