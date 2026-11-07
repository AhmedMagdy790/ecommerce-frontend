import React, { createContext, useContext, useState, useEffect } from "react";
import type { Country } from "@/features/country/model/types/country.types";
import { locationService } from "@/services/locationService";

interface RegionContextType {
  selectedCountry: Country | null;
  countries: Country[];
  currency: string;
  isLoading: boolean;
  changeCountry: (country: Country) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const STORAGE_KEY_CODE = "app_selected_country_code";
const STORAGE_KEY_COUNTRIES = "app_cached_countries";

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initRegion() {
      try {
        let activeCountries: Country[] = [];

        const cachedCountries = localStorage.getItem(STORAGE_KEY_COUNTRIES);
        if (cachedCountries) {
          activeCountries = JSON.parse(cachedCountries);
          setCountries(activeCountries);
        }

        const freshCountries = await locationService.getCountries();
        if (freshCountries && freshCountries.length > 0) {
          activeCountries = freshCountries;
          setCountries(activeCountries);
          localStorage.setItem(STORAGE_KEY_COUNTRIES, JSON.stringify(activeCountries));
        }

        if (!activeCountries.length) return;

        // 3. تحديد الدولة المختارة مسبقاً أو الافتراضية
        const savedCode = localStorage.getItem(STORAGE_KEY_CODE);
        let currentCountry = activeCountries.find((c) => c.code === savedCode);

        if (!currentCountry) {
          currentCountry = activeCountries.find((c) => c.code === "EG") || activeCountries[0];
        }

        setSelectedCountry(currentCountry);
      } catch (error) {
        console.error("Failed to load region settings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initRegion();
  }, []);

  const changeCountry = (country: Country) => {
    setSelectedCountry(country);
    localStorage.setItem(STORAGE_KEY_CODE, country.code);
  };

  const currency = selectedCountry?.currency || "EGP";

  return (
    <RegionContext.Provider
      value={{
        selectedCountry,
        countries,
        currency,
        isLoading,
        changeCountry,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
};