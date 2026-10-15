// src/feature/navigation/dashboard/hook/useNavigationPage.ts


import { useModal } from "@/shared/hooks/useModal";
import { useNavigationTable } from "./useNavigationTable";
import { useNavigationActions } from "./useNavigationActions";

export function useNavigationPage() {
  const table = useNavigationTable();
  const modal = useModal();

  const actions = useNavigationActions();

  return {
    ...table,
    ...modal,
    ...actions,
  };
}