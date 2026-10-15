// src/features/cities/hook/useCityPage.ts

import { useCityActions } from "./useCityActions";
import { useCityModal } from "./useCityModal";
import { useCityTable } from "./useCityTable";

export function useCityPage() {
  const table = useCityTable();
  const modal = useCityModal();
  const actions = useCityActions();

  return {
    ...table,
    ...modal,
    ...actions,
  };
}