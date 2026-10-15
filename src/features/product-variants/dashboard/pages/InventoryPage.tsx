// src/features/inventory/dashboard/ui/InventoryPage.tsx

import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import DataTable from "@/shared/components/DataTable/DataTable";
import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";

import { useInventoryPage } from "@/features/inventory/dashboard/hooks/useInventoryPage";
import { getInventoryFilters } from "@/features/inventory/dashboard/constants/inventoryFilters";
import { getInventoryColumns } from "@/features/inventory/dashboard/constants/inventoryColumns";
import type { Inventory } from "@/features/inventory/model/types/inventory.types";
import InventoryModal from "@/features/inventory/dashboard/components/modal/BaseModalInventory";

export default function InventoryPage() {
    const { t } = useTranslation("inventory");
    const { lang } = useLang();

    const {
        isOpen: isModalOpen,
        editingItem: inventoryEdit,
        openEditModal,
        closeModal,
        currentData,
        pagination,
        handleDelete,
        openCreateModal,
        showTrashed,
        setShowTrashed,
        isLoading,
        status,
        handleServerFilterOrPageChange,
    } = useInventoryPage();

    const inventoryFilters = useMemo(() =>
        getInventoryFilters(t, lang),
        [t, lang]
    );

    const columns = useMemo(() => getInventoryColumns({
        t,
        lang: lang
    }), [
        t,
        lang
    ]);

    void status;

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <HeaderDashboard 
                t={t}
                openCreateModal={openCreateModal}
            >
                <Button
                    variant={showTrashed ? "outline" : "secondary"}
                    onClick={() => setShowTrashed(!showTrashed)}
                >
                    {showTrashed
                        ? (lang === "ar" ? "عرض النشط" : "View Active")
                        : (lang === "ar" ? "الأرشيف" : "View Trashed")}
                </Button>
            </HeaderDashboard>

            {/* <InventoryStats
                stats={status}
            /> */}

            <DataTable<Inventory>
                data={currentData}
                loading={isLoading}
                meta={pagination}
                paginationMode={pagination?.type || "server"}
                filterSideServer={handleServerFilterOrPageChange}
                columns={columns}
                filterFields={inventoryFilters}
                onDelete={(item) => handleDelete(item.id)}
                onEdit={(item) => openEditModal(item)}
                renderMobileCard={(item) => {
                    const productName = item?.product_variant?.sku
                    const sku = item.product_variant?.sku || "";
                    return (
                        <div>
                            <p className="font-bold text-[var(--color-text-primary)]">
                                {productName || t("inventory.item", "Inventory Item")}
                            </p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                SKU: {sku} — Stock: {item.stock_quantity}
                            </p>
                        </div>
                    );
                }}
            />

            <InventoryModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                inventory={inventoryEdit}
            />
        </div>
    );
}