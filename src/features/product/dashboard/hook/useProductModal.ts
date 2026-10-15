// src/features/product/dashboard/hooks/useProductModal.ts
import { useState } from "react";
import type { Product } from "../../model/types/product.types";

export function useProductModal() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const openCreateModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return {
        selectedProduct,
        isModalOpen,
        setIsModalOpen,
        openCreateModal,
        handleEdit,
    };
}