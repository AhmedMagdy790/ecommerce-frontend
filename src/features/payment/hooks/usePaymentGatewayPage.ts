// src/features/payment/dashboard/hooks/usePaymentGatewayPage.ts

import { usePaymentGatewayActions } from "./usePaymentGatewayActions";
import { usePaymentGatewayTable } from "./usePaymentGatewayTable";
import { useModal } from "@/shared/hooks/useModal";

export function usePaymentGatewayPage() {
  const table = usePaymentGatewayTable();
  const modal = useModal();

  const actions = usePaymentGatewayActions(table.showTrashed);

  return {
    ...table,
    ...modal,
    ...actions,
  };
}