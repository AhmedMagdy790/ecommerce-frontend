import React, { useEffect, useState, useCallback, useMemo } from "react";
import { PlusIcon, DollarSignIcon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { Button } from "@/shared/components/Button";

import { useShippingRateStore } from "../store/useShippingRateStore";
import ShippingRateModal from "../modal/ShippingRateModal";

import { type IShippingRate } from "../types/types";
import { useShippingCourierStore } from "../store/useShippingCourierStore";

export default function ShippingRatesPage() {
  const { lang } = useLang();

  // Stores - تم جلب pagination والتخلص من المتغيرات القديمة
  const {
    rates,
    pagination,
    fetchRatesAll,
    toggleShippingRateStatus,
    deleteRate,
    isLoading,
  } = useShippingRateStore();

  console.log("rates", rates)
  const { fetchShippingCouriers, items: shippingCouriers } = useShippingCourierStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<IShippingRate | null>(null);

  // دالة جلب الأسعار الموحدة مع حفظ مرجعها
  const handleFetchData = useCallback(async (params?: any) => {
    await fetchRatesAll(params);
  }, [fetchRatesAll]);

  // جلب البيانات الأساسية مرة واحدة عند الـ Mount بدون تكرار
  useEffect(() => {
    fetchShippingCouriers();
    handleFetchData({ page: 1 });
  }, [handleFetchData, fetchShippingCouriers]);

  // الفلترة من طرف السيرفر
  const handleFilterServer = useCallback((filters: any) => {
    fetchRatesAll(filters);
  }, [fetchRatesAll]);

  // تهيئة خيارات شركات الشحن بداخل الفلتر
  const selectOptionShipping = useMemo(() => {
    if (!shippingCouriers) return [];

    const options = shippingCouriers.map((courier) => ({
      label: courier.name,
      value: courier.id.toString(),
    }));

    return [
      { 
        label: lang === "ar" ? "كل شركات الشحن" : "All Couriers", 
        value: ""
      },
      ...options,
    ];
  }, [shippingCouriers, lang]);

  // ======================
  // Filters Configuration
  // ======================
  const filters: FilterField[] = [
    {
      label: lang === "ar" ? "شركة الشحن" : "Courier",
      key: "courier",
      type: "select",
      options: selectOptionShipping,
    },
    {
      label: lang === "ar" ? "الحالة" : "Status",
      key: "is_active",
      type: "select",
      options: [
        { label: "All", value: null },
        { label: lang === "ar" ? "نشط" : "Active", value: "1" },
        { label: lang === "ar" ? "غير نشط" : "Inactive", value: "0" },
      ],
    },
  ];

  // ======================
  // Actions
  // ======================
  const handleDelete = async (item: IShippingRate) => {
    const rateId = item.id;

    if (!rateId) return;

    const isConfirmed = await confirm({
      title: lang === "ar" ? "حذف تسعيرة الشحن" : "Delete Shipping Rate",
      description: lang === "ar" ? "هل أنت متأكد من حذف هذه التسعيرة؟" : "Are you sure you want to delete this rate?",
      confirmText: lang === "ar" ? "نعم" : "Yes",
      cancelText: lang === "ar" ? "لا" : "No",
    });

    if (!isConfirmed) return;

    await deleteRate(rateId);
    handleFetchData({ page: pagination?.current_page || 1 });
  };

  const handleToggleStatus = async (item: IShippingRate) => {

    await toggleShippingRateStatus(item.id);
    handleFetchData({ page: pagination?.current_page || 1 });
  };

  // ======================
  // Columns Definition
  // ======================
  const columns = [
      {
        header: lang === "ar" ? "شركة الشحن" : "Courier",
        accessor: (item: IShippingRate) => item.courier?.name || "N/A"
      },
      {
        header: lang === "ar" ? "المدينة" : "City",
        accessor: (item: IShippingRate) => item.city?.name || "N/A"
      },
      {
        header: lang === "ar" ? "التكلفة الأساسية" : "Base Cost",
        accessor: (item: IShippingRate) => `${item.fees?.base_cost || 0} EGP`,
      },
      {
        header: lang === "ar" ? "رسوم الشحن" : "Shipping Fee",
        accessor: (item: IShippingRate) => `${item.fees?.shipping_fee || 0} EGP`,
      },
      {
        header: lang === "ar" ? "مدة التوصيل" : "Delivery Time",
        accessor: (item: IShippingRate) => `${item.delivery_time?.from}-${item.delivery_time?.to} days`,
      },
      {
        header: lang === "ar" ? "الحالة" : "Status",
        accessor: (item: IShippingRate) => (
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              await handleToggleStatus(item);
            }}
            className={`
              px-3 
              py-1 
              rounded-full 
              text-xs 
              font-medium 
              transition-colors 
              cursor-pointer
              ${
                item.settings.is_active
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-[var(--red-500)]/10 text-[var(--red-500)] border border-[var(--red-500)]/20"
              }
            `}
          >
            {item.settings.is_active 
              ? (lang === "ar" ? "نشط" : "Active") 
              : (lang === "ar" ? "معطل" : "Inactive")}
          </button>
        )
      },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: "var(--font-outfit)" }}>
      {/* Header Section */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
            <DollarSignIcon className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          {lang === "ar" ? "إدارة أسعار الشحن" : "Shipping Rates Management"}
        </h1>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedRate(null);
            setIsModalOpen(true);
          }}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          {lang === "ar" ? "إضافة تسعيرة جديدة" : "Add New Rate"}
        </Button>
      </div>

      {/* Main Table Section */}
      <DataTable
        data={rates || []}
        columns={columns}
        isLoading={isLoading}
        paginationType={pagination.type} 
        meta={pagination}
        onFilterChange={handleFetchData}
        filterSideServer={handleFilterServer}
        filterFields={filters}
        lang={lang}
        onEdit={(item) => {
          setSelectedRate(item);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        renderMobileCard={(item) => (
          <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)] w-full">
            <div>
              <p className="font-bold text-sm text-[var(--color-text-primary)]">{item.courier?.name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{item.city?.name}</p> 
            </div>
            <p className="font-semibold text-sm text-[var(--color-primary)]">{item.fees?.base_cost || 0} EGP</p>
          </div>
        )}
      />

      {/* Modal */}
      {isModalOpen && (
        <ShippingRateModal
          isOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            handleFetchData({ page: pagination?.current_page || 1 });
          }}
          rate={selectedRate}
        />
      )}
    </div>
  );
}