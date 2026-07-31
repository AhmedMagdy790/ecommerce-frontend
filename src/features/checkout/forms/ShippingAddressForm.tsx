// src/pages/Checkout/forms/ShippingAddressForm.tsx

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { useLocations } from "../hooks/useLocations";
import { MapPin } from "lucide-react";
import { Input } from "@/shared/components/Input";
import CustomSelect from "@/shared/components/CustomSelect";

interface ShippingAddressFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingAddressForm({ onNext, onBack }: ShippingAddressFormProps) {
  const { t, i18n } = useTranslation("checkout");
  const currentLang = i18n.language;
  
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();

  const selectedCountryId = watch("country_id");

  const {
    countries,
    cities,
    loadingCountries,
    loadingCities,
    countriesError,
    citiesError,
  } = useLocations(selectedCountryId);

  const countryOptions = countries.map((country) => {
    const countryId = country.id ?? country.country_id;
    const countryName = country.name ?? country.title;
    return {
      value: countryId,
      label: countryName,
    };
  });

  const cityOptions = cities.map((city) => {
    const cityId = city.id ?? city.city_id;
    const cityName = city.name ?? city.title;
    return {
      value: cityId,
      label: cityName,
    };
  });

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("address.title", "Shipping Address")}</h2>
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
          <MapPin size={16} className="text-[var(--color-primary)]" />
          <span>{t("address.deliveryLocation", "Delivery Location")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Country Selection */}
        <div>
          <Controller
            name="country_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={t("address.countryId", "Country")}
                placeholder={currentLang === "ar" ? "اختر الدولة..." : "Select country..."}
                options={countryOptions}
                value={field.value ?? ""}
                disabled={loadingCountries}
                onChange={(val) => {
                  const countryId = val ? Number(val) : undefined;
                  field.onChange(countryId);
                  
                  const selectedCountry = countries.find((c) => (c.id ?? c.country_id) === countryId);
                  const countryName = selectedCountry?.name ?? selectedCountry?.title;
                  if (setValue) {
                    setValue("country", countryName, { shouldValidate: true });
                    setValue("city_id", undefined, { shouldValidate: true });
                    setValue("city", "", { shouldValidate: true });
                  }
                }}
                error={errors.country_id?.message ? String(errors.country_id.message) : countriesError || undefined}
              />
            )}
          />
        </div>

        {/* City Selection */}
        <div>
          <Controller
            name="city_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={t("address.cityId", "City")}
                placeholder={
                  !selectedCountryId
                    ? (currentLang === "ar" ? "اختر الدولة أولاً..." : "Select country first...")
                    : loadingCities
                    ? (currentLang === "ar" ? "جاري تحميل المدن..." : "Loading cities...")
                    : (currentLang === "ar" ? "اختر المدينة..." : "Select city...")
                }
                options={cityOptions}
                value={field.value ?? ""}
                disabled={!selectedCountryId || loadingCities}
                onChange={(val) => {
                  const cityId = val ? Number(val) : undefined;
                  field.onChange(cityId);

                  const selectedCity = cities.find((c) => (c.id ?? c.city_id) === cityId);
                  const cityName = selectedCity?.name ?? selectedCity?.title;
                  if (setValue) {
                    setValue("city", cityName, { shouldValidate: true });
                  }
                }}
                error={errors.city_id?.message ? String(errors.city_id.message) : citiesError || undefined}
              />
            )}
          />
        </div>

        {/* Street Address Line (maps to backend shipping_address) */}
        <div className="sm:col-span-2 mb-2">
          <Input
            id="shipping-address"
            label={t("address.addressLine", "Street Address")}
            type="text"
            {...register("shipping_address")}
            placeholder="123 Main St"
            error={errors.shipping_address?.message ? String(errors.shipping_address.message) : undefined}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            id="shipping-address2"
            label={t("address.addressLine2", "Street Address 2")}
            type="text"
            {...register("shipping_address2")}
            placeholder="123 Main St"
            error={errors.shipping_address2?.message ? String(errors.shipping_address2.message) : undefined}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", "Back")}
        </Button>

        <Button type="button" onClick={onNext}>
          {t("buttons.next", "Continue to Shipping")}
        </Button>
      </div>
    </section>
  );
}