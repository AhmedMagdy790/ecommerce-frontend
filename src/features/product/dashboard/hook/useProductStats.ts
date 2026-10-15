// src/features/product/dashboard/hooks/useProductStats.ts
import type { Product } from "../../model/types/product.types";

export function useProductStats(products: Product[]) {
    const activeCount = products.filter(p => p.status === 'active').length;

    return {
        activeCount,
    };
}