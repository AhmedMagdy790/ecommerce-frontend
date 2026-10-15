// src/features/product/dashboard/hooks/useProductsPage.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useProductStore } from "../../model/store/useProductStore";
import type { Product } from "../../model/types/product.types";
import type { TranslatedText } from "@/shared/types/types";

export function useProductsPage() {
    const [showTrashed, setShowTrashed] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product<TranslatedText> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const isFetching = useRef(false);

    const {
        pagination,
        fetch,
        fetchTrashed,
        items,
        trashedItems,
        delete: deleteProduct,
        restore,
        forceDelete,
        toggleStatus,
    } = useProductStore();




    const activeCount = items.filter(p => p.status === 'active').length;

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

    const handleFilterServer = useCallback((filters: any) => {
        if (showTrashed) {
            return fetchTrashed(filters);
        }
        fetch(filters);
    }, [showTrashed, fetch, fetchTrashed]); 

    const handleEdit = (product: Product<TranslatedText>) => {
        console.log("Selected Product:", product);

        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number | string) => {
        const result = await confirm({
            title: "Delete Product",
            description: "Are you sure you want to delete this product?",
            confirmText: "Confirm",
            cancelText: "Cancel",
        });

        if (!result) return;
        await deleteProduct(id);
    };

    const handleForceDelete = async (id: number | string) => {
        const result = await confirm({
            title: "Force Delete Product",
            description: "Are you sure you want to delete this product?",
            confirmText: "Confirm",
            cancelText: "Cancel",
        });

        if (!result) return;
        await forceDelete(id);
    };

    const handleRestore = async (id: number | string) => {
        await restore(id);
    };

    const handleStatusChange = (id: number | string) => {
        if (showTrashed) return;
        toggleStatus(id);
    };

    const openCreateModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    return {
        showTrashed,
        setShowTrashed,
        selectedProduct,
        isModalOpen,
        setIsModalOpen,
        products: items,
        trashedProducts: trashedItems,
        pagination,
        activeCount,
        handleFilterServer,
        handleEdit,
        handleForceDelete,
        handleDelete,
        handleRestore,
        handleStatusChange,
        openCreateModal,
    };
}