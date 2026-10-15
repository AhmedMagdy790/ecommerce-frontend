// src/features/shipping/ui/ShippingCouriersPage.tsx
import { useCallback, useMemo } from "react";
import { Truck, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

import { getShippingCourierColumns } from "../constants/shippingCourierColumns";
import ShippingCourierModal from "../components/ShippingCourierModal";
import ShippingStats from "../components/ShippingStats.tsx";
import { useShippingCourierPage } from "../../hooks/useShippingCourierPage";
import type { ShippingCourier } from "../../model/types/shipping.types";
import type { TranslatedText } from "@/shared/types/types.ts";

export default function ShippingCouriersPage() {
  const { t } = useTranslation("shipping");
  const { lang } = useLang();

  const {
    // من هوك الصفحة الخاص بالشحن
    currentData,
    stats,
    isLoading,
    pagination,
    showTrashed,
    setShowTrashed,
    handleServerFilterOrPageChange,
    shippingFilters,

    // من مودال الشحن
    isOpen: isModalOpen,
    editingItem: editingCourier,
    openCreateModal,
    openEditModal,
    closeModal,

    // العمليات (حذف، استرجاع، تغيير الحالة)
    handleDelete,
    handleRestore,
    handleStatusChange,
    togglingId,
  } = useShippingCourierPage();


  const handleDeleteRow = useCallback(
    (item: ShippingCourier) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getShippingCourierColumns({
        t,
        lang,
        showTrashed,
        togglingId,
        onStatusChange: handleStatusChange,
      }),
    [t, lang, showTrashed, togglingId, handleStatusChange]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <Truck className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة شركات الشحن" : "Shipping Courier Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button
            variant={showTrashed ? "outline" : "secondary"}
            onClick={() => setShowTrashed(!showTrashed)}
          >
            {showTrashed ? t("view_active") : t("view_trashed")}
          </Button>

          {!showTrashed && (
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              <span>{lang === "ar" ? "إضافة شركة شحن" : "Add Courier"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* 📊 بطاقات الإحصائيات (متصلة بالبيانات القادمة من الباك إند ومحمية بـ memo) */}
      {stats && <ShippingStats stats={stats} />}

      {/* DataTable Component */}
      <DataTable<ShippingCourier<TranslatedText>>
        data={currentData}
        loading={isLoading}
        showTrashed={showTrashed}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={shippingFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
        onRestore={(item) => handleRestore(item.id)}
      />

      {/* Shipping Courier Modal (Create / Edit) */}
      <ShippingCourierModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        courier={editingCourier}
      />
    </div>
  );
}