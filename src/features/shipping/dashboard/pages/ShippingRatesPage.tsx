// src/features/shipping/ui/ShippingRatesPage.tsx
import { useCallback, useMemo } from "react";
import { DollarSign, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

import { getShippingRateColumns } from "../constants/shippingRateColumns";
import ShippingRateModal from "../components/ShippingRateModal";
import { useShippingRatePage } from "../../hooks/useShippingRatePage";
import type { ShippingRate } from "../../model/types/rate.types";
import type { TranslatedText } from "@/shared/types/types";


export default function ShippingRatesPage() {
  const { t } = useTranslation("shipping");
  const { lang } = useLang();

  const {
    // بيانات الصفحة والـ Pagination
    currentData,
    isLoading,
    pagination,
    handleServerFilterOrPageChange,
    shippingRateFilters,

    // حالات المودال (إضافة / تعديل)
    isOpen: isModalOpen,
    editingItem: editingRate,
    openCreateModal,
    openEditModal,
    closeModal,

    // العمليات (حذف، تغيير الحالة)
    handleDelete,
    handleStatusChange,
    togglingId,
  } = useShippingRatePage();


  const handleDeleteRow = useCallback(
    (item: ShippingRate) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getShippingRateColumns({
        t,
        lang,
        togglingId,
        onStatusChange: handleStatusChange,
      }),
    [t, lang, togglingId, handleStatusChange]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة أسعار الشحن" : "Shipping Rate Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            <span>{lang === "ar" ? "إضافة سعر شحن" : "Add Shipping Rate"}</span>
          </Button>
        </div>
      </div>

      {/* DataTable Component */}
      <DataTable<ShippingRate<TranslatedText>>
        data={currentData}
        loading={isLoading}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={shippingRateFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
      />

      {/* Shipping Rate Modal (Create / Edit) */}
      <ShippingRateModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        rate={editingRate}
      />
    </div>
  );
}