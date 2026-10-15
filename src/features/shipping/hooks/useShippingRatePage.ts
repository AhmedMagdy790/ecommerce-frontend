// src/features/shipping/hooks/useShippingRatePage.ts

import { useShippingRateTable } from "./useShippingRateTable";
import { useShippingRateActions } from "./useShippingRateActions";
import { useModal } from "@/shared/hooks/useModal";

export function useShippingRatePage() {
  const table = useShippingRateTable();
  const modal = useModal();
  
  const actions = useShippingRateActions();

  return {
    ...table,
    ...modal,
    ...actions,
  };
}