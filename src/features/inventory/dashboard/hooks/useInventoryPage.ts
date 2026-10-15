import { useInventoryTable } from "./useInventoryTable";
import { useInventoryActions } from "./useInventoryActions";
import { useModal } from "@/shared/hooks/useModal";

export function useInventoryPage() {
  const table = useInventoryTable();
  const modal = useModal();
  const actions = useInventoryActions();

  return {
    ...table,
    ...modal,
    ...actions,
  };
}