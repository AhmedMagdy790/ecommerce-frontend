// src/feature/category/dashboard/hook/useCategoryPage.ts

import { useCategoryTable } from "./useCategoryTable";
import { useCategoryActions } from "./useCategoryActions";
import { useModal } from "@/shared/hooks/useModal";

export function useCategoryPage() {
  const table = useCategoryTable();
  const modal = useModal();

  const actions = useCategoryActions(table.showTrashed);

  return {
    ...table,
    ...modal,
    ...actions,
  };
}