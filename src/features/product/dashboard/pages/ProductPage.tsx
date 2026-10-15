// src/features/product/dashboard/pages/ProductPage.tsx
import { useTranslation } from "react-i18next";

import DataTable from "@/shared/components/DataTable/DataTable";

import BaseModalProduct from "../components/modal/BaseModalProduct";
import { useProductsPage } from "@/features/product/shared/hooks/useProductsPage";
import { getProductColumns } from "../constants/ProductColumns";
import { getProductFilters } from "../constants/productFilters";
import { useMemo } from "react";
import type { Product } from "../../model/types/product.types";
import type { TranslatedText } from "@/shared/types/types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useLang } from "@/shared/context/LanguageContext";
import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import ProductStatusCards from "../components/ProductStatusCards";
import type { InitialProductData } from "../../model/types/productForm.types";

export default function ProductPage() {
    const { t } = useTranslation("product");
    const { lang } = useLang();


    const {
        showTrashed,
        setShowTrashed,
        selectedProduct,
        isModalOpen,
        setIsModalOpen,
        products,
        trashedProducts,
        pagination,
        handleFilterServer,
        handleEdit,
        handleDelete,
        handleRestore,
        handleStatusChange,
        openCreateModal,
    } = useProductsPage();

    const productFilters = useMemo(() =>
        getProductFilters(t),
        [
            t
        ]
    );

    const columns = useMemo(() => getProductColumns({
        t,
        lang: lang,
        showTrashed,
        onStatusChange: handleStatusChange,
    }), [
        t,
        lang,
        showTrashed,
        handleStatusChange,
    ]);


    return (
        <div className="p-6 lg:p-8 space-y-8">


            <HeaderDashboard 
                t={t}
                showTrashed={showTrashed}
                onToggleTrashed={() => {setShowTrashed(!showTrashed)}}
                openCreateModal={openCreateModal}
            />

            <ProductStatusCards />

            <DataTable<Product<TranslatedText>>
                data={showTrashed ? trashedProducts : products}
                showTrashed={showTrashed}
                meta={pagination}
                paginationMode={pagination.type}
                filterSideServer={handleFilterServer}
                columns={columns}
                filterFields={productFilters as unknown as never}
                onDelete={(item) => handleDelete(item.id)}
                onEdit={(item) => handleEdit(item)}
                onRestore={(item) => handleRestore(item.id)}
                renderMobileCard={(item) => {
                    const name = getLocalizedName(item.name, lang);
                    const brand = getLocalizedName(item?.brand?.name ?? "", lang) || "";
                    return (
                        <div>
                            <p className="font-bold text-[var(--color-text-primary)]">{name}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">{brand}</p>
                        </div>
                    );
                }}
            />

            <BaseModalProduct
                isOpen={isModalOpen}
                closeModal={() => setIsModalOpen(false)}
                product={selectedProduct as InitialProductData | null}
            />
        </div>
    );
}