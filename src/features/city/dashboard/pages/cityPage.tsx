// src/pages/cities/ui/CityPage.tsx
import { useCallback, useMemo } from "react";
import { Building2Icon, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import type { City } from "../../model/types/city.types";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { getCityColumns } from "../constants/CityColumns";
import { useCityPage } from "../hook/useCityPage";
import CityModal from "../modal/CityModal";
import type { TranslatedText } from "@/shared/types/types";

export default function CityPage() {
  const { t } = useTranslation("city");
  const { lang } = useLang();

  const {
    // البيانات والإحصائيات من الـ Hook الخاص بالمدن
    currentData,
    isLoading,
    stats,
    pagination,
    handleServerFilterOrPageChange,
    cityFilters,

    // Modal التحكم (إضافة / تعديل)
    isModalOpen,
    editingCity,
    openCreateModal,
    openEditModal,
    closeModal,

    // الأكشنات (حذف، تغيير الحالة)
    handleDelete,
    handleStatusChange,
    togglingId,
  } = useCityPage();

  const handleDeleteRow = useCallback(
    (item: City) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getCityColumns({
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
          <Building2Icon className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة المدن" : "City Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button onClick={openCreateModal} className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            <span>{lang === "ar" ? "إضافة مدينة" : "Add City"}</span>
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات التلقائية (Stats Cards) */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-secondary)]">إجمالي المدن</p>
            <p className="text-2xl font-bold mt-1 text-[var(--color-text-primary)]">{stats.total}</p>
          </div>
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
            <p className="text-sm text-green-600">المدن النشطة</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{stats.active}</p>
          </div>
          <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border border-[var(--color-border)]">
            <p className="text-sm text-orange-600">المدن غير النشطة</p>
            <p className="text-2xl font-bold mt-1 text-orange-600">{stats.inactive}</p>
          </div>
        </div>
      )}

      {/* DataTable Component */}
      <DataTable<City<TranslatedText>>
        data={currentData}
        loading={isLoading}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={cityFilters}
        onDelete={(deleteHandler) => handleDeleteRow(deleteHandler)}
        onEdit={(item) => openEditModal(item)}
      />

      {/* City Modal (Create / Edit) */}
      <CityModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        city={editingCity}
      />
    </div>
  );
}