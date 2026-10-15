// src/features/product/dashboard/hooks/useProductsData.ts
import { useEffect, useRef, useState, useCallback } from "react";
import type { ProductFilters } from "../../model/types/product.types";
import { useProductStore } from "../../model/store/useProductStore";

export function useProductsData() {
    const [showTrashed, setShowTrashed] = useState(false);
    const isFetching = useRef(false);

    const {
        pagination,
        fetch,
        fetchTrashed,
        items,
        trashedItems,
    } = useProductStore();

    const loadData = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;

        try {
            if (showTrashed) {
                await fetchTrashed();
            } else {
                await fetch();
            }
        } finally {
            isFetching.current = false;
        }
    }, [showTrashed, fetchTrashed, fetch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFilterServer = useCallback((filters: Partial<ProductFilters>) => {
        if (showTrashed) {
            return fetchTrashed(filters);
        }
        fetch(filters);
    }, [showTrashed, fetch, fetchTrashed]);

    return {
        showTrashed,
        setShowTrashed,
        products: items,
        trashedProducts: trashedItems,
        pagination,
        handleFilterServer,
    };
}