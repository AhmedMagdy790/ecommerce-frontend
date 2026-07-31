import React, { useEffect, useState, useCallback } from "react";
import { PlusIcon, TruckIcon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { Button } from "@/shared/components/Button";

import { type IShippingCourier } from "../types/types";
import { useShippingCourierStore } from "../store/useShippingCourierStore";
import ShippingCourierModal from "../modal/ShippingCourierModal";

export default function ShippingCourierPage() {
  const { lang } = useLang();
  const [showTrashed, setShowTrashed] = useState<boolean>(false);
  const [selectedCourier, setSelectedCourier] = useState<IShippingCourier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    fetchShippingCouriers,
    fetchTrashedShippingCouriers,
    items: shippingCouriers,
    trashedItems: trashedShippingCouriers,
    stats,
    pagination,
    isLoading,
    toggleIsLoading,
    restoreShippingCourier,
    deleteShippingCourier,
    toggleShippingCourierStatus,
  } = useShippingCourierStore();


  const loadData = useCallback(async (filters: Record<string, any> = {}) => {
    try {
      if (showTrashed) {
        await fetchTrashedShippingCouriers();
      } else {
        await fetchShippingCouriers(filters);
      }
    } catch (err) {
      console.error("Error loading couriers:", err);
    }
  }, [showTrashed, fetchShippingCouriers, fetchTrashedShippingCouriers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // Filters
  // =========================
  const filters: FilterField[] = [
    {
      key: "name",
      label: lang === "ar" ? "اسم شركة الشحن" : "Courier Name",
      type: "text",
      placeholder: "Search...",
    },
    {
      key: "is_active",
      label: lang === "ar" ? "الحالة" : "Status",
      type: "select",
      options: [
        { label: lang === "ar" ? "الكل" : "All", value: "" },
        { label: lang === "ar" ? "نشط" : "Active", value: "1" },
        { label: lang === "ar" ? "معطل" : "Inactive", value: "0" },
      ],
    },
  ];

  // =========================
  // Actions
  // =========================
  const handleEdit = (item: IShippingCourier) => {
    setSelectedCourier(item);
    setIsModalOpen(true);
  };

  const handleRestore = async (id: number) => {
    const success = await restoreShippingCourier(id);
    if (success) {
      loadData();
    }
  };

  const handleDelete = async (id: number) => {
    const result = await confirm({
      title: lang === "ar" ? "حذف شركة الشحن" : "Delete Courier",
      description: lang === "ar" ? "هل أنت متأكد من عملية الحذف؟" : "Are you sure?",
      confirmText: lang === "ar" ? "نعم" : "Yes",
      cancelText: lang === "ar" ? "لا" : "No",
    });

    if (!result) return;

    await deleteShippingCourier(id);
    loadData();
  };

  const handleToggle = async (id: number) => {
    if (showTrashed) return;
    await toggleShippingCourierStatus(id);
  };

  // =========================
  // Columns
  // =========================
  const columns = [
    {
      header: lang === "ar" ? "الاسم" : "Name",
      accessor: (item: IShippingCourier) => {
        if (typeof item.name === "object" && item.name !== null) {
          return item.name[lang] || item.name["ar"] || item.name["en"] || "N/A";
        }
        return item.name;
      },
    },
    {
      header: lang === "ar" ? "الكود" : "Code",
      accessor: "code",
    },
    {
      header: lang === "ar" ? "الدعم COD" : "COD",
      accessor: (item: IShippingCourier) => (
        <span className={`text-xs font-semibold ${item.supports_cod ? "text-emerald-600" : "text-[var(--color-text-muted)]"}`}>
          {item.supports_cod ? (lang === "ar" ? "نعم" : "Yes") : (lang === "ar" ? "لا" : "No")}
        </span>
      ),
    },
    {
      header: lang === "ar" ? "الحالة" : "Status",
      accessor: (item: IShippingCourier) => (
        <Button
          type="button"
          onClick={() => handleToggle(item.id)}
          disabled={showTrashed}
          isLoading={toggleIsLoading}
          className={`
            px-3 
            py-1 
            rounded-full 
            text-xs 
            font-medium 
            transition-colors 
            ${showTrashed ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
            ${
              item.is_active
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-[var(--red-500)]/10 text-[var(--red-500)] border border-[var(--red-500)]/20"
            }
          `}
        >
          {item.is_active ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "معطل" : "Inactive")}
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: "var(--font-outfit)" }}>
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
            <TruckIcon className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          {lang === "ar" ? "شركات الشحن" : "Shipping Couriers"}
        </h1>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedCourier(null);
            setIsModalOpen(true);
          }}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          {lang === "ar" ? "إضافة شركة" : "Add Courier"}
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
          {lang === "ar" ? "نشط" : "Active"} ({stats?.active || 0})
          {!showTrashed && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-[var(--color-primary)]" />}
        </button>

        <button
          type="button"
          onClick={() => setShowTrashed(true)}
          className={`
            pb-3 
            px-6 
            text-sm 
            font-medium 
            transition-colors 
            relative 
            cursor-pointer
            ${showTrashed ? "text-[var(--red-500)] font-bold" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}
          `}
        >
          <div className="flex items-center gap-2">
            {lang === "ar" ? "المحذوفات" : "Trash"}
            <span className="bg-[var(--red-500)]/10 text-[var(--red-500)] border border-[var(--red-500)]/20 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {stats?.trashed || 0}
            </span>
          </div>
          {showTrashed && <div className="absolute bottom-0 start-0 w-full h-0.5 bg-[var(--red-500)]" />}
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-[var(--color-surface-secondary)] rounded-[var(--radius-lg)] animate-pulse border border-[var(--color-border)]" />
          ))}
        </div>
      ) : (
        <DataTable
          data={(showTrashed ? trashedShippingCouriers : shippingCouriers) || []}
          showTrashed={showTrashed}
          meta={pagination}
          columns={columns}
          filterFields={filters}
          lang={lang}
          onEdit={handleEdit}
          onDelete={(item) => handleDelete(item.id)}
          onRestore={(item) => handleRestore(item.id)}
          onFilterChange={(appliedFilters) => {
            loadData(appliedFilters);
          }}
          renderMobileCard={(item) => (
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
              <div>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">
                  {typeof item.name === "object" && item.name !== null
                    ? item.name[lang] || item.name["ar"] || item.name["en"] || "N/A"
                    : item.name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">{item.code}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-[var(--red-500)]"}`} />
            </div>
          )}
        />
      )}

      {/* Modal */}
      <ShippingCourierModal
        isOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
          loadData();
        }}
        courier={selectedCourier}
      />
    </div>
  );
}