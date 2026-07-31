import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    PlusIcon,
    PackageIcon,
    TagIcon,
    ArchiveIcon,
    LayersIcon,
} from "lucide-react";

import { useLang } from "@/shared/context/LanguageContext";
import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { confirm } from "@/shared/components/confirmModal/confirm";

import { useProductStore } from "../store/useProductStore";
import { useCategoryStore } from "@/features/dashboard/category/store/useCategoryStore";
import BaseModalProduct from "../modal/BaseModalProduct";
import type { IProduct, TProductStatus } from "../types/types";

export default function ProductPage() {
    const { lang } = useLang();

    const [showTrashed, setShowTrashed] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const isFetching = useRef(false);

    const {
        pagination,
        fetchAdminProducts,
        fetchTrashed,
        products,
        trashedProducts,
        deleteProduct,
        restoreProduct,
        updateProductStatus
    } = useProductStore();

    const { adminCategories } = useCategoryStore();
    const activeCount = products.filter(p => p.status === 'active').length;

    const loadData = useCallback(async () => {
        if (isFetching.current) return;

        isFetching.current = true;

        try {
            if (showTrashed) {
                await fetchTrashed();
            } else {
                await fetchAdminProducts();
            }
        } finally {
            isFetching.current = false;
        }
    }, [showTrashed, fetchTrashed, fetchAdminProducts]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFilterServer = useCallback((filters: any) => {
        if (showTrashed) {
            return fetchTrashed(filters);
        }
        
        fetchAdminProducts(filters);
    }, [showTrashed, fetchAdminProducts, fetchTrashed]); 

    // Filters
    const productFilters: FilterField[] = [
        {
            key: "name",
            label: lang === "ar" ? "اسم المنتج" : "Product Name",
            type: "text",
            placeholder: "Search...",
        },
        {
            key: "brand",
            label: lang === "ar" ? "الماركة" : "Brand",
            type: "text",
            placeholder: "Apple...",
        },
        {
            key: "min_price",
            label: lang === "ar" ? "بدية السعر" : "Min Price",
            type: "text",
            placeholder: "",
        },
        {
            key: "status",
            label: lang === "ar" ? "الحالة" : "Status",
            type: "select",
            options: [
                { label: "All", value: null },
                { label: "Active", value: "active" },
                { label: "Archived", value: "archived" },
                { label: "Draft", value: "draft" },
            ],
        },
    ];

    // Actions
    const handleEdit = (product: IProduct) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await confirm({
            title: "Delete Product",
            description: "Are you sure you want to delete this product?",
            confirmText: "Confirm",
            cancelText: "Cancel",
        });

        if (!result) return;

        await deleteProduct(id);
    };

    const handleRestore = async (id: number) => {
        await restoreProduct(id);
    };

    const handleStatus = (id: number, status: TProductStatus) => {
        if (showTrashed) return;
        updateProductStatus(id, status);
    };

    // Columns
    const productColumns = [
        {
            header: lang === "ar" ? "الاسم" : "Name",
            accessor: "name",
        },
        {
            header: lang === "ar" ? "الماركة" : "Brand",
            accessor: "brand",
        },
        {
            header: lang === "ar" ? "القسم" : "Category",
            accessor: (item: IProduct) => {
                const category = adminCategories.find(
                    (cat) => cat.id === item.category?.id
                );
                return category?.name || "-";
            },
        },
        {
            header: lang === "ar" ? "الحالة" : "Status",
            accessor: "status",
            render: (status: TProductStatus, item: IProduct) => (
                <button
                    onClick={() => handleStatus(item.id, status)}
                    className={`
                        px-3 
                        py-1 
                        rounded-full 
                        text-xs 
                        font-medium
                        transition-transform
                        active:scale-95
                        ${status === "active"
                            ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20"
                            : status === "draft"
                                ? "bg-[var(--warning-500)]/10 text-[var(--warning-600)] border border-[var(--warning-500)]/20"
                                : "bg-[var(--red-500)]/10 text-[var(--color-error)] border border-[var(--red-500)]/20"
                        }
                    `}
                >
                    {status}
                </button>
            ),
        },
        {
            header: lang === "ar" ? "المتغيرات" : "Variants",
            accessor: (item: IProduct) => (
                <span className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] px-2.5 py-1 rounded-[var(--radius-md)] text-xs font-medium shadow-[var(--shadow-xs)]">
                    <LayersIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    {item.variants?.length || 0}
                </span>
            ),
        },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                    <PackageIcon className="w-6 h-6 text-[var(--color-primary)]" />
                    {lang === "ar" ? "إدارة المنتجات" : "Manage Products"}
                </h1>

                <button
                    onClick={() => {
                        setSelectedProduct(null);
                        setIsModalOpen(true);
                    }}
                    className="
                        inline-flex 
                        items-center 
                        justify-center 
                        gap-2 
                        rounded-[var(--radius-md)] 
                        bg-[var(--color-primary)] 
                        px-4 
                        py-2.5 
                        text-sm 
                        font-medium 
                        text-white 
                        hover:bg-[var(--color-primary-hover)] 
                        transition-all 
                        duration-[var(--duration-fast)]
                        shadow-[var(--shadow-xs)]
                        active:scale-95
                    "
                >
                    <PlusIcon className="w-4 h-4" />
                    {lang === "ar" ? "إضافة منتج" : "Add Product"}
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-4 text-[var(--color-text-secondary)]">
                {/* Total Products */}
                <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--card-bg)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--blue-50)] text-[var(--color-primary)]">
                            <TagIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                {lang === "ar" ? "إجمالي المنتجات" : "Total Products"}
                            </p>
                            <p className="font-bold text-xl text-[var(--color-text-primary)] mt-0.5 flex items-center gap-2">
                                {products.length} 
                                <span className="text-xs font-medium text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-0.5 rounded-full">
                                    {activeCount} {lang === "ar" ? "نشط" : "active"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trashed Products */}
                <div
                    onClick={() => setShowTrashed(!showTrashed)}
                    className={`
                        p-5 
                        rounded-[var(--radius-xl)] 
                        shadow-[var(--shadow-xs)] 
                        cursor-pointer 
                        transition-all 
                        duration-[var(--duration-fast)]
                        bg-[var(--card-bg)]
                        border 
                        ${showTrashed ? "border-[var(--color-error)] bg-[var(--red-500)]/5" : "border-[var(--color-border)]"}
                    `}
                >
                    <div className="flex gap-4 items-center">
                        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--red-500)]/10 text-[var(--color-error)]">
                            <ArchiveIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
                                {lang === "ar" ? "المنتجات المحذوفة" : "Trashed Products"}
                            </p>
                            <p className="font-bold text-xl text-[var(--color-text-primary)] mt-0.5">
                                {trashedProducts.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={showTrashed ? trashedProducts : products}
                showTrashed={showTrashed}
                meta={pagination}
                filterSideServer={handleFilterServer}
                columns={productColumns}
                filterFields={productFilters}
                lang={lang}
                onDelete={(item) => handleDelete(item.id)}
                onEdit={(item) => handleEdit(item)}
                onRestore={(item) => handleRestore(item.id)}
                renderMobileCard={(item) => (
                    <div>
                        <p className="font-bold text-[var(--color-text-primary)]">{item.name}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{item.brand}</p>
                    </div>
                )}
            />

            <BaseModalProduct
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                product={selectedProduct}
            />
        </div>
    );
}