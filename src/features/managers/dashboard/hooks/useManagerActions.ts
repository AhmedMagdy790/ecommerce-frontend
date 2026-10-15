// src/features/managers/dashboard/hooks/useUserActions.ts

import { useCallback, useState } from "react";
import { useManagerStore } from "../../model/store/useManagerStore";
import type { EntityId } from "@/shared/types/entity";
import type { UserStatus } from "@/features/users/model/types/user.types";

export function useManagerActions() {
  const {
    delete: deleteItem,
    changeStatus
  } = useManagerStore();

  const [actionLoadingId, setActionLoadingId] = useState<number | string | null>(null);

  const handleDelete = useCallback(
    async (id: number | string) => {
      try {
        setActionLoadingId(id);
        await deleteItem(id);
      } finally {
        setActionLoadingId(null);
      }
    },
    [deleteItem]
  );


  const handleStatusChange = useCallback(
    async (id: EntityId, status: UserStatus) => {
      try {
        setActionLoadingId(id);
        await changeStatus(id, status);
      } finally {
        setActionLoadingId(null);
      }
    },
    [changeStatus]
  )

  return {
    handleDelete,
    handleStatusChange,
    actionLoadingId,
  };
}