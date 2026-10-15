// src/features/users/dashboard/hooks/useUserActions.ts

import { useCallback, useState } from "react";
import { useUserStore } from "../../model/store/useUserStore";

export function useUserActions() {
  const {
    delete: deleteItem
  } = useUserStore();

  const [actionLoadingId, setActionLoadingId] = useState<number | string | null>(null);

  // 1. الحذف المؤقت (Move to Trash)
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


  return {
    handleDelete,
    actionLoadingId,
  };
}