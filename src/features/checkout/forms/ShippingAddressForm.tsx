// src/pages/Checkout/forms/ShippingAddressForm.tsx

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
  const { isRTL, lang } = useLang();
  
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
        <h2 
          className="text-xl font-bold text-text-primary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("address.title", { defaultValue: lang === "ar" ? "عنوان الشحن" : "Shipping Address" })}
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <MapPin size={16} className="text-primary" />
          <span style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}>
            {t("address.deliveryLocation", { defaultValue: lang === "ar" ? "موقع التسليم" : "Delivery Location" })}
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
                label={t("address.countryId", { defaultValue: lang === "ar" ? "الدولة" : "Country" })}
                placeholder={t("address.selectCountry", { defaultValue: lang === "ar" ? "اختر الدولة..." : "Select country..." })}
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
                label={t("address.cityId", { defaultValue: lang === "ar" ? "المدينة" : "City" })}
                placeholder={
                  !selectedCountryId
                    ? t("address.selectCountryFirst", { defaultValue: lang === "ar" ? "اختر الدولة أولاً..." : "Select country first..." })
                    : loadingCities
                    ? t("address.loadingCities", { defaultValue: lang === "ar" ? "جاري تحميل المدن..." : "Loading cities..." })
                    : t("address.selectCity", { defaultValue: lang === "ar" ? "اختر المدينة..." : "Select city..." })
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
            label={t("address.addressLine", { defaultValue: lang === "ar" ? "العنوان (الشارع / المبنى)" : "Street Address" })}
            type="text"
            {...register("shipping_address")}
            placeholder={lang === "ar" ? "الشارع الرئيسي، المبنى" : "123 Main St"}
            error={errors.shipping_address?.message ? String(errors.shipping_address.message) : undefined}
          />
        </div>
        
        {/* Street Address Line 2 */}
        <div className="sm:col-span-2">
          <Input
            id="shipping-address2"
            label={t("address.addressLine2", { defaultValue: lang === "ar" ? "تفاصيل إضافية للعنوان (اختياري)" : "Street Address 2 (Optional)" })}
            type="text"
            {...register("shipping_address2")}
            placeholder={lang === "ar" ? "الشقة، الدور، علامة مميزة" : "Apt, Suite, Building (Optional)"}
            error={errors.shipping_address2?.message ? String(errors.shipping_address2.message) : undefined}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", { defaultValue: lang === "ar" ? "السابق" : "Back" })}
        </Button>

        <Button type="button" onClick={onNext}>
          {t("buttons.next", { defaultValue: lang === "ar" ? "المتابعة إلى خيارات الشحن" : "Continue to Shipping" })}
        </Button>
      </div>
    </section>
  );
}