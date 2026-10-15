import { usePageTable } from "./usePageTable";
import { usePageModal } from "./usePageModal";
import { usePageActions } from "./usePageActions";

export function usePagePage() {
  const table = usePageTable();
  const modal = usePageModal();
  const actions = usePageActions();

  return {
    ...table,
    ...modal,
    ...actions,
  };
}