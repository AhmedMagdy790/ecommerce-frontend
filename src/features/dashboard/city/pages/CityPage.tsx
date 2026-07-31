import React, { useEffect, useState, useMemo } from "react";
import { useCityStore } from "../store/useCityStore";
import CityModal from "../modal/CityModal";
import { PlusIcon, SearchIcon, MapPinIcon, GlobeIcon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";
import { type ICity } from "../types";
import DataTable from "@/shared/components/DataTable/DataTable";
import { type FilterField } from "@/shared/components/DataTable/FiltterDataTable";
import { useCountryStore } from "@/features/dashboard/country/store/useCountryStore";
import CustomSelect from "@/shared/components/CustomSelect";
import { type ICountry } from "@/features/dashboard/country/types";



export default function CityPage() {
  const { lang } = useLang();
  
  // استدعاء المتاجر (Stores)
  const { fetchCities, loading: citiesLoading, getFilteredCities, deleteCity, cities } = useCityStore();
  const { fetchCountriesForAdmin, countries } = useCountryStore();

  const [selectedCountryId, setSelectedCountryId] = useState<number>("");
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cityFilters: FilterField[] = [
    {
      key: "name",
      label: "City Name",
      type: "text",
      placeholder: "Search by city name...",
    },

    {
      key: "city_code",
      label: "City Code",
      type: "text",
      placeholder: "EX: CAI",
    },

    {
      key: "is_active",
      label: "Status",
      type: "select",
      options: [
        { label: "All", value: null },
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },
  ]; 

  const countryOptions = useMemo(() => {
    return countries.map((country: ICountry) => ({
      label: lang === "ar" ? country.name.ar : country.name.en,
      value: country.id.toString()
    }));
  }, [countries, lang]);


  // 1. جلب الدول عند تحميل الصفحة لأول مرة
  useEffect(() => {
    fetchCountriesForAdmin();
  }, [fetchCountriesForAdmin]);

  // 2. جلب المدن فقط عندما يتغير معرف الدولة المختار
  useEffect(() => {
    if (selectedCountryId) {
      fetchCities(selectedCountryId);
    }
  }, [selectedCountryId, fetchCities]);


  const filteredCities = getFilteredCities();

  const handleEdit = (cityId: string) => {
    const city = filteredCities.find((c) => String(c.id) === String(cityId));
    if (city) {
      setSelectedCity(city);
      setIsModalOpen(true);
    }
  };

  const cityColumns = [
    { 
      header: lang === "ar" ? "المدينة" : "City", 
      accessor: (item: ICity) => item.name?.[lang] || item.name?.ar || "---"
    },
    { 
      header: lang === "ar" ? "كود المدينة" : "City Code", 
      accessor: "city_code" 
    },
    { 
      header: lang === "ar" ? "الحالة" : "Status", 
      accessor: (item: ICity) => (
        <span className={item.is_active ? "text-green-500" : "text-red-500"}>
          {item.is_active ? "✔" : "✖"}
        </span>
      )
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8" style={{ fontFamily: 'var(--font-outfit)' }}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-title-md font-bold text-[var(--color-gray-900)] dark:text-white flex items-center gap-3">
            <div className="p-2 bg-[var(--color-brand-50)] dark:bg-brand-950/30 rounded-lg">
               <MapPinIcon className="size-6 text-[var(--color-brand-500)]" />
            </div>
            {lang === "ar" ? "إدارة المدن" : "Manage Cities"}
          </h1>
        </div>

        <button 
          onClick={() => {
            setSelectedCity(null);
            setIsModalOpen(true);
          }}
          disabled={!selectedCountryId}
          className={`btn-primary flex items-center justify-center gap-2 px-6 py-3 shadow-theme-md ${!selectedCountryId && 'opacity-50 cursor-not-allowed'}`}
        >
          <PlusIcon className="size-4" />
          {lang === "ar" ? "إضافة مدينة جديدة" : "Add New City"}
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
   

        <CustomSelect
            label="Country"
            value={selectedCountryId}
            onChange={(val) => setSelectedCountryId(val)}
            placeholder="Select country..."
            options={countryOptions}
        />

          

      </div>

      {/* Table Section */}
      {!selectedCountryId ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed">
          <p className="text-red-500">يرجى اختيار دولة أولاً ليتم عرض المدن التابعة لها.</p>
        </div>
      ) : citiesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : (
        <DataTable
          data={filteredCities}
          columns={cityColumns}
          filterFields={cityFilters} 
          lang={lang}
          onDelete={(item) => deleteCity(item.id)}
          onEdit={(item) => handleEdit(item.id)}
          renderMobileCard={(item) => (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{item.name?.[lang]}</p>
                <p className="text-xs text-gray-400">{item.city_code || "---"}</p>
              </div>
            </div>
          )}
        />
      )}

      {/* Modal */}
      <CityModal 
        isOpen={isModalOpen} 
        closeModal={() => setIsModalOpen(false)} 
        selectedCity={selectedCity}
        defaultCountryId={selectedCountryId} 
      />
    </div>
  );
}