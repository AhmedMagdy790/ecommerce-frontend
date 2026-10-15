// src/features/users/dashboard/hook/useUserPage.ts
import { useUserTable } from "./useUserTable";
import { useUserModal } from "./useUserModal";
import { useUserActions } from "./useUserActions";

export function useUserPage() {
  const table = useUserTable();
  const modal = useUserModal();
  const actions = useUserActions();

  return {
    ...table,
    ...modal,
    ...actions,
  };
}