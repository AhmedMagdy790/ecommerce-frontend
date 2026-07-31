import React, { useEffect, useState, useCallback, useRef } from "react";
import { useCountryStore } from "../store/useCountryStore";
import CountryModal from "../modal/CountryModal";
import { PlusIcon, GlobeIcon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import { type ICountry } from "../types";
import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { Button } from "@/shared/components/Button";
import { confirm } from "@/shared/components/confirmModal/confirm";

const countryFilters: FilterField[] = [
  {
    key: "name",
    label: "Country Name",
    type: "text",
    placeholder: "Search by name...",
  },
  {
    key: "code",
    label: "Country Code",
    type: "text",
    placeholder: "EX: EG",
  },
  {
    key: "phone_code",
    label: "Phone Code",
    type: "number",
    placeholder: "EX: 20",
  },
  {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Active", value: "1" },
      { label: "Inactive", value: "0" },
    ],
  },
];

export default function CountryPage() {
  const { lang } = useLang();
  
  // استيراد deleteCountry مع باقي الدوال والمتغيرات من الستور
  const { 
    countries,
    pagination,
    fetchCountriesForAdmin, 
    loading, 
    deleteCountry
  } = useCountryStore();



  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // تثبيت مرجع الدالة لمنع أي لوب مستقبلي
  const fetchRef = useRef(fetchCountriesForAdmin);
  fetchRef.current = fetchCountriesForAdmin;

  // دالة واحدة موحدة لجلب البيانات وإدارة الفلاتر والصفحات
  const loadData = useCallback(async (filters = {}) => {
    await fetchRef.current(filters);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleServerFilter = (filters: Record<string, any>) => {
    loadData(filters);
  };

  const handlePageChange = (page: number) => {
    loadData({ page });
  };

  const handleEdit = (country: ICountry) => {
    if (country) {
      setSelectedCountry(country);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (item: ICountry) => {
    const result = await confirm({
      title: "Delete Country",
      description: "Are you sure?",
      confirmText: "Confirm",
      cancelText: "Cancel",
    });

    if (!result || !item?.id) return;

    await deleteCountry(item.id);
    loadData();
  };

  const countryColumns = [
    { 
      header: lang === "ar" ? "الدولة" : "Country", 
      accessor: (item: ICountry) => {
        if (!item.name) return "---";
        return typeof item.name === 'string' 
          ? item.name 
          : item.name[lang] || item.name.ar || item.name.en || "---";
      }
    },
    { 
      header: lang === "ar" ? "الكود" : "Code", 
      accessor: "code" 
    },
    { 
      header: lang === "ar" ? "الحالة" : "Status", 
      accessor: (item: ICountry) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
          item.is_active
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            : "bg-[var(--red-500)]/10 text-[var(--red-500)] border-[var(--red-500)]/20"
        }`}>
          {item.is_active 
            ? (lang === "ar" ? "نشط" : "Active") 
            : (lang === "ar" ? "معطل" : "Inactive")}
        </span>
      )
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: 'var(--font-outfit)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <div className="p-2.5 bg-[var(--color-primary)]/10 rounded-[var(--radius-xl)] border border-[var(--color-primary)]/20">
             <GlobeIcon className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          {lang === "ar" ? "إدارة الدول" : "Countries Management"}
        </h1>

        <Button 
          variant="primary"
          onClick={() => {
            setSelectedCountry(null);
            setIsModalOpen(true);
          }}
          leftIcon={<PlusIcon className="w-4 h-4" />}
        >
          {lang === "ar" ? "إضافة دولة جديدة" : "Add New Country"}
        </Button>
      </div>

      {loading && countries.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-[var(--card-bg)] rounded-[var(--radius-2xl)] border border-[var(--color-border)]" />
          ))}
        </div>
      ) : (
        <DataTable
          data={countries || []}
          columns={countryColumns}
          filterFields={countryFilters}
          lang={lang}
          paginationType={pagination?.type === "client" ? "client" : "server"}
          filterSideServer={handleServerFilter}
          meta={
            pagination?.type === "client"
              ? { ...pagination, last_page: Math.ceil(countries.length / 10) } // Adjust last_page dynamically based on client chunking if needed
              : pagination
          }
          onPageChange={handlePageChange}
          onDelete={handleDelete}
          onEdit={(item) => handleEdit(item)}
          renderMobileCard={(item) => (
            <div className="flex justify-between items-center p-4 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--color-border)] w-full">
              <div>
                <span className="font-bold text-sm text-[var(--color-text-primary)]">
                  {typeof item?.name === 'string' ? item.name : item?.name?.[lang] || item?.name?.ar || "---"}
                </span>
                <p className="text-xs text-[var(--color-text-secondary)]">{item?.code || "---"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                item.is_active
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-[var(--red-500)]/10 text-[var(--red-500)] border-[var(--red-500)]/20"
              }`}>
                {item.is_active ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "معطل" : "Inactive")}
              </span>
            </div>
          )}
        />
      )}

      <CountryModal 
        isOpen={isModalOpen} 
        closeModal={() => {
          setIsModalOpen(false);
          loadData();
        }} 
        selectedCountry={selectedCountry}
      />
    </div>
  );
}