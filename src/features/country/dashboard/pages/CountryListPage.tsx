// src/features/countries/pages/CountryListPage.tsx

import { useEffect, useState } from "react";
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
import { Pagination } from "@/shared/components/Pagination/Pagination";
import { usePrefetchCountries } from "../../hooks/usePrefetchCountries";

export default function CountryListPage() {
  const { 
    items: countries,
    pagination,
    fetch, 
    isFetching 
  } = useCountryStore();

  const countryStats = countryStatsStore(
    (state) => state.stats
  );

  const { handleDelete, handleStatusChange, togglingId } = useCountryActions(); 
  const { t } = useTranslation("countries");
  const { lang } = useLang();

  const { 
    isOpen, 
    closeModal, 
    openCreateModal, 
    openEditModal, 
    editingCountry 
  } = useCountryModal();

  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  usePrefetchCountries({
    currentPage: pagination?.current_page,
    lastPage: pagination?.last_page
  });

  const handleSelect = (id: number | string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    fetch({ page });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <HeaderDashboard
        title={t("title", "Countries Management")}
        t={t}
        createButtonLabel={t("add_new", "Add New Country")}
        openCreateModal={openCreateModal}
      />

      <ImportCountriesButton />

      {countryStats && <CountryStatsCards stats={countryStats} />}

      {isFetching && countries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Loading countries...</div>
      ) : countries.length === 0 ? (
        <CountryEmptyState openCreateModal={openCreateModal} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {countries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                currentAppLang={lang}
                togglingId={togglingId}
                isSelected={selectedIds.includes(country.id)}
                onSelect={handleSelect}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onToggleStatus={handleStatusChange}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <CountryModal
        isOpen={isOpen}
        closeModal={closeModal}
        country={editingCountry}
      />
    </div>
  );
}