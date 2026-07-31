import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapPinIcon, PlusIcon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { Button } from "@/shared/components/Button";

import { useShippingCityStore } from "../store/useShippingCityStore";
import { useShippingCourierStore } from "../store/useShippingCourierStore";
import ShippingCityModal from "../modal/AssignCourierModal";

import { type IShippingCity } from "../types/types";

export default function ShippingSettingsPage() {
  const { lang } = useLang();

  // 1. استدعاء الستيت والدوال من متجر مدن الشحن المحدث
  const { 
    shippingCities, 
    paginationType,
    meta,
    fetchShippingCities, 
    removeCity, 
    isLoading 
  } = useShippingCityStore();

  // 2. متجر شركات الشحن لتغذية خيارات المودال
  const { items: shippingCouriers, fetchShippingCouriers } = useShippingCourierStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<IShippingCity | null>(null);

  // جلب شركات الشحن مرة واحدة فقط عند تحميل الصفحة الأولية
  useEffect(() => {
    fetchShippingCouriers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchData = useCallback(async (params?: any) => {
    if (fetchShippingCities) {
      await fetchShippingCities(params);
    }
  }, [fetchShippingCities]);

  // التحميل الأولي لمدن الشحن عند فتح الصفحة
  useEffect(() => {
    handleFetchData({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // تحضير خيارات شركات الشحن للمودال (Memoized)
  const courierOptions = useMemo(() => {
    return (shippingCouriers ?? []).map((courier) => ({
      label: courier.name,
      value: Number(courier.id),
    }));
  }, [shippingCouriers]);

  // ======================
  // Filters Configuration
  // ======================
  const filters: FilterField[] = [
    {
      key: "city_name",
      label: lang === "ar" ? "المدينة" : "City",
      type: "text",
      placeholder: lang === "ar" ? "ابحث باسم المدينة..." : "Search city...",
    },
    {
      key: "courier_name",
      label: lang === "ar" ? "شركة الشحن" : "Courier",
      type: "text",
      placeholder: lang === "ar" ? "ابحث باسم الشركة..." : "Search courier...",
    },
  ];

  // ======================
  // Columns Definition
  // ======================
  const columns = [
    {
      header: lang === "ar" ? "المدينة" : "City",
      accessor: (item: IShippingCity) => item.city_name || "N/A",
    },
    {
      header: lang === "ar" ? "شركة الشحن" : "Courier",
      accessor: (item: IShippingCity) => {
        return item.courier_name || (item as any).courier?.name || (lang === "ar" ? "غير معين" : "Not Assigned");
      },
    },
    {
      header: lang === "ar" ? "التكلفة" : "Cost",
      accessor: (item: IShippingCity) => `${item.shipping_cost || (item as any).base_cost || 0} EGP`,
    },
    {
      header: "COD",
      accessor: (item: IShippingCity) => (
        <span className={`text-xs font-semibold ${item.cod_supported ? "text-emerald-600" : "text-[var(--color-text-muted)]"}`}>
          {item.cod_supported ? (lang === "ar" ? "نعم" : "Yes") : (lang === "ar" ? "لا" : "No")}
        </span>
      ),
    },
    {
      header: lang === "ar" ? "الحالة" : "Status",
      accessor: (item: IShippingCity) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            item.is_active
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-[var(--red-500)]/10 text-[var(--red-500)] border-[var(--red-500)]/20"
          }`}
        >
          {item.is_active 
            ? (lang === "ar" ? "نشط" : "Active") 
            : (lang === "ar" ? "معطل" : "Inactive")}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: "var(--font-outfit)" }}>
      
      {/* Header Container */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
            <MapPinIcon className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          {lang === "ar" ? "إدارة مدن الشحن" : "Shipping Cities Management"}
        </h1>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedCity(null);
            setIsModalOpen(true);
          }}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          {lang === "ar" ? "تعيين مدينة" : "Assign City"}
        </Button>
      </div>

      {/* Dynamic Data Table */}
      <DataTable
        data={shippingCities || []}
        columns={columns}
        isLoading={isLoading}
        paginationType={paginationType}
        meta={meta}
        onFilterChange={handleFetchData}
        filterSideServer={handleFetchData}
        filterFields={filters}
        lang={lang}
        onEdit={(item) => {
          setSelectedCity(item);
          setIsModalOpen(true);
        }}
        onDelete={(item: IShippingCity) => {
          const cityId = item.city_id || (item as any).id;
          const courierId = item.shipping_courier_id || (item as any).shipping_courier_id;
          if (cityId && courierId) {
            removeCity(cityId, courierId);
            handleFetchData({ page: meta?.current_page || 1 });
          }
        }}
        renderMobileCard={(item) => (
          <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)] w-full">
            <div>
              <p className="font-bold text-sm text-[var(--color-text-primary)]">{item.city_name}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{item.courier_name || (item as any).courier?.name || "N/A"}</p> 
            </div>
            <p className="font-semibold text-sm text-[var(--color-primary)]">{item.shipping_cost || (item as any).base_cost || 0} EGP</p>
          </div>
        )}
      />

      {/* Unified Management Modal Entry */}
      {isModalOpen && (
        <ShippingCityModal
          isOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            handleFetchData({ page: meta?.current_page || 1 });
          }}
          city={selectedCity}
          courierOptions={courierOptions}
        />
      )}
    </div>
  );
}