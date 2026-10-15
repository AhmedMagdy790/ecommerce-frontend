// src/features/product/dashboard/hooks/useProductActions.ts
import { useCallback } from "react";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useProductStore } from "../../model/store/useProductStore";

export function useProductActions(showTrashed: boolean) {
    const {
        delete: deleteProduct,
        restore,
        toggleStatus,
    } = useProductStore();

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

    const handleRestore = async (id: number | string) => {
        await restore(id);
    };

    const handleStatusChange = useCallback((id: number | string) => {
        if (showTrashed) return;
        toggleStatus(id);
    }, [showTrashed, toggleStatus]);

    return {
        handleDelete,
        handleRestore,
        handleStatusChange,
    };
}