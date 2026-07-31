import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { PlusIcon, DatabaseIcon } from "lucide-react";

import { useLang } from "@/shared/context/LanguageContext";
import { useProductVariantStore } from "../store/useProductVariantStore";
import ProductVariantModal from "../modal/ProductVariantModal";
import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { InputNumber } from "@/shared/components/InputNumber";
import { Button } from "@/shared/components/Button";

export default function ProductVariantPage() {
    const { lang } = useLang();
    const { productId } = useParams();
    const [showTrashed, setShowTrashed] = useState<boolean>(false);

    const {
        fetchAdminVariants,
        variants,
        fetchByProduct,
        updateVariantStatus,
        paginationType,
        meta,
        deleteVariant,
        restoreVariant,
        updateStock,
        isLoading
    } = useProductVariantStore();

    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const isFetching = useRef(false);

    // =========================
    // تحميل البيانات (Load Data)
    // =========================
    const loadData = useCallback(async () => {
        if (isFetching.current) return;

        isFetching.current = true;
        try {
            if (showTrashed) {
                // await fetchTrashedByProduct(Number(productId));
            } else {
                await fetchAdminVariants([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            isFetching.current = false;
        }
    }, [showTrashed, productId, fetchAdminVariants]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // =========================
    // الفلاتر (Filters)
    // =========================
    const variantFilters: FilterField[] = [
        {
            key: "sku",
            label: lang === "ar" ? "رمز SKU" : "SKU Code",
            type: "text",
            placeholder: "Search SKU...",
        },
        {
            key: "status",
            label: lang === "ar" ? "الحالة" : "Status",
            type: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
    ];

    // =========================
    // الأكشن (Actions)
    // =========================
    const handleEdit = (variant: any) => {
        setSelectedVariant(variant);
        setIsOpen(true);
    };

    const handleFilterServer = useCallback((filters: any) => {
        fetchAdminVariants(filters);
    }, [fetchAdminVariants]);

    const handleToggleCategoryStatus = (id: number | string, status: string) => {
        if (showTrashed) {
            confirm({
                title: "",
                description: "لا يمكن تغير فوضع الحذف الامن?",
                confirmText: "Confirm",
                cancelText: "Cancel",
            });
            return;
        }
        updateVariantStatus(id, status);
    };

    const handleDelete = async (id: number) => {
        const result = await confirm({
            title: lang === "ar" ? "حذف المتغير" : "Delete Variant",
            description: lang === "ar" ? "هل أنت متأكد من نقل هذا المتغير إلى الأرشيف؟" : "Are you sure you want to archive this?",
            confirmText: lang === "ar" ? "تأكيد" : "Confirm",
            cancelText: lang === "ar" ? "إلغاء" : "Cancel",
        });

        if (result) {
            await deleteVariant(id);
            loadData();
        }
    };

    const handleRestore = async (id: number) => {
        await restoreVariant(id);
        loadData();
    };

    // =========================
    // تعريف الأعمدة (Table Columns)
    // =========================
    const columns = [
        {
            header: lang === "ar" ? "اسم المنتج" : "Name Product",
            accessor: (item: any) => (
                <div className="flex flex-col">
                    <span className={!item?.product ? "text-[var(--color-error)] italic font-medium" : "font-medium mb-[2px] text-[var(--color-text-primary)]"}>
                        {item?.product?.name || (lang === "ar" ? "منتج غير موجود أو محذوف" : "Product missing/deleted")}
                    </span>
                    {item?.product?.status === 'archived' && (
                        <span className="text-[10px] text-nowrap bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-[var(--radius-sm)] w-fit font-medium">
                            {lang === "ar" ? "الأصل مؤرشف" : "Parent Archived"}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: "SKU",
            accessor: "sku",
        },
        {
            header: lang === "ar" ? "المواصفات" : "Attributes",
            accessor: (item: any) => (
                <div className="flex gap-1 flex-wrap">
                    {item.attributes && Object.entries(item.attributes)?.slice(0, 2)?.map(([k, val]: [string, any]) => (
                        <span key={k} className="px-2 py-0.5 text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-[var(--radius-sm)] border border-[var(--color-primary)]/20 font-medium">
                            {k}: {val}
                        </span>
                    ))}
                </div>
            )
        },
        {
            header: lang === "ar" ? "السعر" : "Price",
            accessor: (item: any) => (
                <span className="font-bold text-[var(--color-text-primary)]">
                    {item.price} <span className="text-[10px] text-[var(--color-text-muted)] font-normal">USD</span>
                </span>
            )
        },
        {
            header: lang === "ar" ? "المخزون" : "Stock",
            accessor: (item: any) => (
                <div className="min-w-[130px]">
                    <InputNumber
                        min={0}
                        step={1}
                        isHoverPop={true}
                        onValueChange={(val) => updateStock(item.id, Number(val))}
                        containerClassName=""
                        value={item.stock || 0}
                    />
                </div>
            )
        },
        {
            header: lang === "ar" ? "الحالة" : "Status",
            accessor: (item: any) => (
                <button
                    type="button"
                    onClick={() => handleToggleCategoryStatus(item.id, item.status)}
                    className={`
                        px-3 
                        py-1 
                        rounded-full 
                        text-xs 
                        font-medium 
                        transition-colors 
                        cursor-pointer
                        ${
                            item.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-[var(--red-500)]/10 text-[var(--red-500)] border border-[var(--red-500)]/20"
                        }
                    `}
                >
                    {item.status === "active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "معطل" : "Inactive")}
                </button>
            )
        }
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: 'var(--font-outfit)' }}>
            {/* Stats */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="p-4 bg-[var(--card-bg)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xs)] border border-[var(--color-border)] flex items-center gap-4 backdrop-blur-xl">
                    <div className="p-3 bg-[var(--color-primary)]/10 rounded-[var(--radius-lg)] border border-[var(--color-primary)]/20">
                        <DatabaseIcon className="text-[var(--color-primary)] w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--color-text-secondary)]">{lang === "ar" ? "إجمالي المتغيرات" : "Total Variants"}</p>
                        <p className="text-xl font-bold text-[var(--color-text-primary)]">{variants.length}</p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    onClick={() => { setSelectedVariant(null); setIsOpen(true); }}
                    leftIcon={<PlusIcon className="w-4 h-4" />}
                >
                    {lang === "ar" ? "إضافة متغير" : "Add Variant"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)] mb-6">
                <button
                    type="button"
                    onClick={() => setShowTrashed(false)}
                    className={`
                        pb-3 
                        px-6 
                        text-sm 
                        font-medium 
                        transition-colors 
                        relative 
                        cursor-pointer
                        ${!showTrashed ? "text-[var(--color-primary)] font-bold" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}
                    `}
                >
                    {lang === "ar" ? "المتغيرات النشطة" : "Active Variants"}
                    {!showTrashed && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-[var(--color-primary)]" />}
                </button>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)] animate-pulse border border-[var(--color-border)]" />
                    ))}
                </div>
            ) : (
                <DataTable
                    data={variants}
                    columns={columns}
                    filterFields={variantFilters}
                    paginationType={paginationType} 
                    meta={meta}
                    filterSideServer={handleFilterServer}
                    lang={lang}
                    onEdit={handleEdit}
                    onDelete={(item) => handleDelete(item.id)}
                    onRestore={(item) => handleRestore(item.id)}
                    renderMobileCard={(item) => (
                        <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                            <div>
                                <p className="font-bold text-sm text-[var(--color-text-primary)]">{item.sku}</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">{item.price} USD</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-[var(--color-text-primary)] font-medium">Stock: {item.stock}</p>
                            </div>
                        </div>
                    )}
                />
            )}

            {/* Modal */}
            <ProductVariantModal
                isOpen={isOpen}
                closeModal={() => setIsOpen(false)}
                productId={productId}
                variant={selectedVariant}
            />
        </div>
    );
}