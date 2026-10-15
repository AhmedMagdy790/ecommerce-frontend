// src/features/shipping/hooks/useShippingCourierPage.ts

import { useShippingCourierTable } from "./useShippingCourierTable";
import { useShippingCourierActions } from "./useShippingCourierActions";
import { useModal } from "@/shared/hooks/useModal";

export function useShippingCourierPage() {
  const table = useShippingCourierTable();
  const modal = useModal();
  
  const actions = useShippingCourierActions(table.showTrashed);

  return {
    ...table,
    ...modal,
    ...actions,
  };
}