import { useEffect } from "react";
import { Input } from "@/shared/components/ui/Input";
import CustomSelect from "@/shared/components/CustomSelect";
import { useTranslation } from "react-i18next";
import type { FieldError } from "react-hook-form";
import { useLocations } from "@/features/checkout/hooks/useLocations";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useLang } from "@/shared/context/LanguageContext";

export interface ShippingAddressData {
  fullName: string;
  phone: string;
  country: string;
  country_id?: number | string;
  city: string;
  city_id?: number | string;
  addressLine1: string;
  addressLine2?: string | undefined;
  postalCode?: string | undefined;
}

interface ShippingAddressProps {
  value: ShippingAddressData;
  onChange: (value: ShippingAddressData) => void;
  error?: {
    fullName?: FieldError;
    phone?: FieldError;
    country?: FieldError;
    country_id?: FieldError;
    city?: FieldError;
    city_id?: FieldError;
    addressLine1?: FieldError;
    addressLine2?: FieldError;
    postalCode?: FieldError;
  };
}

export default function ShippingAddress({
  value,
  onChange,
  error,
}: ShippingAddressProps) {
  const { t } = useTranslation("checkout");
  const { lang } = useLang();

  const {
    countries,
    cities,
    loadingCountries,
    loadingCities,
  } = useLocations(
    value.country_id === undefined ? undefined : Number(value.country_id)
  );


  // Clear city if country changes
  useEffect(() => {
    if (!value.country_id && value.city_id) {
      onChange({
        ...value,
        city: "",
        city_id: undefined,
      });
    }
  }, [value.country_id]);

  const handleChange = (
    key: keyof ShippingAddressData,
    newValue: string | number
  ) => {
    onChange({
      ...value,
      [key]: newValue,
    });
  };


  const countryOptions = countries.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const cityOptions = cities.map((ci) => ({
    label: ci.name,
    value: ci.id,
  }));

  return (
    <section
      className="
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        p-6
      "
    >
      <h2 className="mb-6 text-xl font-semibold">
        {t("shippingAddress.title")}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input
            id="shipping-full-name"
            label={t("shippingAddress.fullName")}
            type="text"
            value={value.fullName}
            onChange={(e) =>
              handleChange("fullName", e.target.value)
            }
            placeholder={t("shippingAddress.fullName")}
            error={error?.fullName?.message}
          />
        </div>

        <div>
          <Input
            id="shipping-phone"
            label={t("shippingAddress.phone")}
            type="tel"
            value={value.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
            placeholder={t("shippingAddress.phone")}
            error={error?.phone?.message}
          />
        </div>

        <div>
          <CustomSelect
            label={t("shippingAddress.country")}
            placeholder={"Select country..."}
            options={countryOptions}
            value={value.country_id ?? ""}
            disabled={loadingCountries}
            onChange={(val) => {
              const selectedCountry = countries.find((c) => c.id === val);
              onChange({
                ...value,
                country_id: val ? Number(val) : undefined,
                country: getLocalizedName(selectedCountry?.name, lang),
                city: "",
                city_id: undefined,
              });
            }}
            error={error?.country_id?.message || error?.country?.message}
          />
        </div>

        <div>
          <CustomSelect
            label={t("shippingAddress.city")}
            placeholder={"Select city..."}
            options={cityOptions}
            value={value.city_id ?? ""}
            disabled={!value.country_id || loadingCities}
            onChange={(val) => {
              const selectedCity = cities.find((ci) => ci.id === val);
              const cityName = selectedCity?.name;

              onChange({
                ...value,
                city_id: selectedCity?.id,
                city: getLocalizedName(cityName, lang),
              });
            }}
            error={error?.city_id?.message || error?.city?.message}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            id="shipping-address-1"
            label={t("shippingAddress.addressLine1")}
            type="text"
            value={value.addressLine1}
            onChange={(e) =>
              handleChange("addressLine1", e.target.value)
            }
            placeholder={t("shippingAddress.addressLine1")}
            error={error?.addressLine1?.message}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            id="shipping-address-2"
            label={t("shippingAddress.addressLine2")}
            type="text"
            value={value.addressLine2 ?? ""}
            onChange={(e) =>
              handleChange("addressLine2", e.target.value)
            }
            placeholder={t("shippingAddress.addressLine2")}
            error={error?.addressLine2?.message}
          />
        </div>

        <div>
          <Input
            id="shipping-postal-code"
            label={t("shippingAddress.postalCode")}
            type="text"
            value={value.postalCode ?? ""}
            onChange={(e) =>
              handleChange("postalCode", e.target.value)
            }
            placeholder={t("shippingAddress.postalCode")}
            error={error?.postalCode?.message}
          />
        </div>
      </div>
    </section>
  );
}