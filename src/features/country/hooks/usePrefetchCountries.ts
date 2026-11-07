import { useEffect } from "react";
import countryService from "../api/country.service";


interface UsePrefetchCountriesProps {
  currentPage?: number;
  lastPage?: number;
  enabled?: boolean;
}

export function usePrefetchCountries({
  currentPage,
  lastPage,
  enabled = true,
}: UsePrefetchCountriesProps) {
  useEffect(() => {
    if (!enabled || currentPage == null || lastPage == null) {
      return;
    }

    const nextPage = currentPage + 1;

    if (nextPage > lastPage) return;

    void countryService
      .prefetch({ page: nextPage })
      .catch((error: unknown) => {
        console.error("Countries prefetch failed:", error);
      });
  }, [currentPage, lastPage, enabled]);
}