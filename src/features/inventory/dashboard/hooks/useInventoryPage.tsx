import { useInventoryTable } from "./useInventoryTable";
import { useInventoryModal } from "./useInventoryModal";
import { useInventoryActions } from "./useInventoryActions";

export function useInventoryPage() {
  const table = useInventoryTable();
  const modal = useInventoryModal();
  const actions = useInventoryActions();

  return {
    ...table,
    ...modal,
    ...actions,
  };
}