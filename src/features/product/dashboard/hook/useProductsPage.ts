// src/features/product/dashboard/hooks/useProductsPage.ts
import { useProductModal } from "./useProductModal";
import { useProductsData } from "./useProductsData";
import { useProductActions } from "./useProductActions";
import { useProductStats } from "./useProductStats";

export function useProductsPage() {
    const modal = useProductModal();
    const data = useProductsData();
    const actions = useProductActions(data.showTrashed);
    const stats = useProductStats(data.products);

    return {
        ...modal,
        ...data,
        ...actions,
        ...stats,
    };
}