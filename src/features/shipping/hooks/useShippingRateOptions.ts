// src/features/shipping/hooks/useShippingRateOptions.ts

import { useEffect, useState, useMemo } from "react";
import { useLang } from "@/shared/context/LanguageContext";
import { getLocalizedName } from "@/shared/utils/localizeName";

import { useShippingCourierStore } from "../model/store/shippingCourier.store";
import { useCountryStore } from "@/features/country/model/store/useCountryStore";
import type { City } from "@/features/city/model/types/city.types";
import type { TranslatedText } from "@/shared/types/types";
import cityService from "@/features/city/api/city.service";

export function useShippingRateOptions(initialCountryId?: number | string | null) {
  const { lang } = useLang();

  // 1. شركات الشحن
  const { items: couriers, fetch: fetchCouriers, isFetching: isCouriersLoading } = useShippingCourierStore();

  // 2. الدول
  const countries = useCountryStore((state) => state.items);
  const fetchCountries = useCountryStore((state) => state.fetch);
  const isCountriesLoading = useCountryStore((state) => state.isFetching);

  // 3. المدن وحالة التحميل الخاصة بها
  const [cities, setCities] = useState<City<TranslatedText>[]>([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  // الحالة المحلية للبلد المحدد لجلب مدنه
  const [selectedCountryId, setSelectedCountryId] = useState<number | string | null>(
    initialCountryId ?? null
  );

  // جلب شركات الشحن والدول عند التحميل الأول
  useEffect(() => {
    if (!couriers || couriers.length === 0) {
      fetchCouriers({});
    }
    if (!countries || countries.length === 0) {
      fetchCountries({});
    }
  }, [couriers, fetchCouriers, countries, fetchCountries]);

  // جلب المدن باستخدام cityService.getByCountryList عند تغيير الدولة المحددة
  useEffect(() => {
    if (selectedCountryId === null || selectedCountryId === undefined) {
      return;
    }

    const fetchCitiesByCountry = async () => {
      try {
        setIsCitiesLoading(true);

        const response = await cityService.getByCountryList(selectedCountryId);

        setCities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch cities by country:", error);
        setCities([]);
      } finally {
        setIsCitiesLoading(false);
      }
    };

    fetchCitiesByCountry();
  }, [selectedCountryId]);

  // دالة لتحديث الدولة وتغيير المدن بناءً عليها
  const handleCountryChange = (countryId: number | string) => {
    setCities([]);
    setSelectedCountryId(countryId);
  };


  // تحويل القوائم إلى صيغة خيارات مناسبة للـ CustomSelect
  const courierOptions = useMemo(() => {
    return (couriers || []).map((courier) => ({
      label: getLocalizedName(courier.name, lang),
      value: courier.id,
    }));
  }, [couriers, lang]);

  const countryOptions = useMemo(() => {
    return (countries || []).map((country) => ({
      label: getLocalizedName(country.name, lang),
      value: country.id,
    }));
  }, [countries, lang]);

  const cityOptions = useMemo(() => {
    return (cities || []).map((city) => ({
      label: getLocalizedName(city.name, lang),
      value: city.id,
    }));
  }, [cities, lang]);

  return {
    courierOptions,
    countryOptions,
    cityOptions,
    isCouriersLoading,
    isCountriesLoading,
    isCitiesLoading,
    selectedCountryId,
    handleCountryChange,
  };
}