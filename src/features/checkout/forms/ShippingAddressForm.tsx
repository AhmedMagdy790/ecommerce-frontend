import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { useLocations } from "../hooks/useLocations";
import { MapPin } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import CustomSelect from "@/shared/components/CustomSelect";
import { useLang } from "@/shared/context/LanguageContext";

interface ShippingAddressFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ShippingAddressForm({ onNext, onBack }: ShippingAddressFormProps) {
  const { t } = useTranslation("checkout");
  const { isRTL } = useLang();
  
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();

  const selectedCountryId = watch("country_id");

  const {
    countries,
    cities,
    countryOptions,
    cityOptions,
    loadingCountries,
    loadingCities,
    countriesError,
    citiesError,
  } = useLocations(selectedCountryId);

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="rounded-panel border border-border bg-surface p-6 space-y-6 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text-primary">
          {t("address.title")}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin size={16} className="text-primary" />
          <span>
            {t("address.deliveryLocation")}
          </span>
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
                label={t("address.countryId")}
                placeholder={t("address.selectCountry")}
                options={countryOptions}
                value={field.value ?? ""}
                disabled={loadingCountries}
                onChange={(val) => {
                  const countryId = val ? Number(val) : undefined;
                  field.onChange(countryId);
                  
                  const selectedCountry = countries.find((c) => c.id === countryId);
                  const countryName = selectedCountry?.name;

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
                label={t("address.cityId")}
                placeholder={
                  !selectedCountryId
                    ? t("address.selectCountryFirst")
                    : loadingCities
                    ? t("address.loadingCities")
                    : t("address.selectCity")
                }
                options={cityOptions}
                value={field.value ?? ""}
                disabled={!selectedCountryId || loadingCities}
                onChange={(val) => {
                  const cityId = val ? Number(val) : undefined;
                  field.onChange(cityId);

                  const selectedCity = cities.find((c) => c.id === cityId);
                  const cityName = selectedCity?.name;

                  if (setValue) {
                    setValue("city", cityName, { shouldValidate: true });
                  }
                }}
                error={errors.city_id?.message ? String(errors.city_id.message) : citiesError || undefined}
              />
            )}
          />
        </div>

        {/* Street Address Line 1 */}
        <div className="sm:col-span-2 mb-2">
          <Input
            id="shipping-address"
            label={t("address.addressLine")}
            type="text"
            {...register("shipping_address")}
            placeholder={t("address.placeholders.addressLine")}
            error={errors.shipping_address?.message ? String(errors.shipping_address.message) : undefined}
          />
        </div>
        
        {/* Street Address Line 2 */}
        <div className="sm:col-span-2">
          <Input
            id="shipping-address2"
            label={t("address.addressLine2")}
            type="text"
            {...register("shipping_address2")}
            placeholder={t("address.placeholders.addressLine2")}
            error={errors.shipping_address2?.message ? String(errors.shipping_address2.message) : undefined}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back")}
        </Button>

        <Button type="button" onClick={onNext}>
          {t("buttons.continueToShipping")}
        </Button>
      </div>
    </section>
  );
}