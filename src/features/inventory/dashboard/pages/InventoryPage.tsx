import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import DataTable from "@/shared/components/DataTable/DataTable";
import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import { useLang } from "@/shared/context/LanguageContext";

import BaseModalInventory from "../components/modal/BaseModalInventory";
import { getInventoryColumns } from "../constants/inventoryColumns";
import { getInventoryFilters } from "../constants/inventoryFilters";
import type { Inventory } from "../../model/types/inventory.types";
import { useInventoryPage } from "../hooks/useInventoryPage";
import { InventoryStatusCards } from "../components/InventoryStatusCards";


// src/features/inventory/dashboard/components/InventoryPage.tsx
export default function InventoryPage() {
    const { t } = useTranslation("inventory");
    const { lang } = useLang();

    const {
        editingItem: selectedInventory,
        isOpen: isModalOpen,
        closeModal,
        currentData,
        status,
        pagination,
        handleServerFilterOrPageChange,
        openEditModal,
        isLoading,
    } = useInventoryPage();

    const inventoryFilters = useMemo(() => getInventoryFilters(t, lang), [t, lang]);
    const columns = useMemo(() => getInventoryColumns({ t, lang }), [t, lang]);

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <HeaderDashboard 
                t={t}
                title={t("inventory.title", "Inventory Management")}
                // حذفنا openCreateModal من هنا
            />

            <InventoryStatusCards status={status} />

            <DataTable<Inventory>
                data={currentData}
                loading={isLoading}
                meta={pagination}
                paginationMode={pagination?.type || "server"}
                filterSideServer={handleServerFilterOrPageChange}
                searchableFields={["product_variant.sku", "stock_quantity", "reserved_quantity"]}
                columns={columns}
                filterFields={inventoryFilters}
                onEdit={(item) => openEditModal(item)}
                // حذفنا onDelete
                renderMobileCard={(item) => {
                    const variantName = item?.product_variant?.sku;
                    return (
                        <div>
                            <p className="font-bold text-[var(--color-text-primary)]">{variantName}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                {t("inventory.stock", "Stock")}: {item.stock_quantity}
                            </p>
                        </div>
                    );
                }}
            />

            <BaseModalInventory
                isOpen={isModalOpen}
                closeModal={closeModal}
                inventory={selectedInventory}
            />
        </div>
    );
}