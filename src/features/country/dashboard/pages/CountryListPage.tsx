// src/features/countries/pages/CountryListPage.tsx

import { useEffect } from "react";
import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import { useTranslation } from "react-i18next";
import { useCountryModal } from "../../hooks/useCountryModal";
import { useCountryStore } from "../../model/store/useCountryStore";
import ImportCountriesButton from "../componetns/ImportCountriesButton";
import { CountryStatsCards } from "../componetns/CountryStatsCards";
import { CountryEmptyState } from "../componetns/CountryEmptyState";
import { CountryCard } from "../componetns/CountryCard";
import { useCountryActions } from "../../hooks/useCountryActions";
import CountryModal from "../componetns/modal/CountryModal";
import { countryStatsStore } from "../../model/store/CountryStatusHooks";
import { useLang } from "@/shared/context/LanguageContext";


export default function CountryListPage() {
  const { 
    items: countries, 
    fetch, 
    isFetching 
  } = useCountryStore();

  const countryStats = countryStatsStore(
    (state) => state.stats
  );


  const { handleDelete, handleStatusChange, togglingId } = useCountryActions(); 
  
  const { t } = useTranslation();
  const { lang } = useLang();


  const { 
    isOpen, 
    closeModal, 
    openCreateModal, 
    openEditModal, 
    editingCountry 
  } = useCountryModal();

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <HeaderDashboard
        title={t("countries.title", "Countries Management")}
        t={t}
        createButtonLabel={t("countries.add_new", "Add New Country")}
        openCreateModal={openCreateModal}
      />

      <ImportCountriesButton />

      {countryStats && <CountryStatsCards stats={countryStats} />}

      {isFetching && countries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Loading countries...</div>
      ) : countries.length === 0 ? (
        <CountryEmptyState openCreateModal={openCreateModal} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              currentAppLang={lang}
              togglingId={togglingId}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggleStatus={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* 🟢 نافذة المودال للإضافة والتعديل */}
      <CountryModal
        isOpen={isOpen}
        closeModal={closeModal}
        country={editingCountry}
      />
    </div>
  );
}