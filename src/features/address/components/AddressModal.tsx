import { useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import { MapPin, Phone, Building, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import type { IModal } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";

import type { Address } from "../model/types/address.types";
import { useAddressForm } from "../hooks/useAddressForm";

import { ActionButtons } from "@/shared/components/ActionButtons";
import { useCountryCity } from "@/features/country/hooks/useCountryCity";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { useLang } from "@/shared/context/LanguageContext";

interface AddressModalProps extends IModal {
  address?: Address | null;
}

export default function AddressModal({ isOpen, closeModal, address }: AddressModalProps) {
  const { t } = useTranslation("addressess");
  const { lang } = useLang();
  const formRef = useRef<HTMLFormElement>(null);

  const isEditMode = !!address;


  const { countries, cities, fetchCities, isLoadingCities } = useCountryCity(address?.country_id);

  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError 
  } = useAddressForm(address, closeModal, isOpen);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedCountryId = watch("country_id");

  const countryOptions = useMemo(() => {
    return (countries || []).map((c) => ({
      label: getLocalizedName(c.name, lang),
      value: c.id,
    }));
  }, [countries]);

  const cityOptions = useMemo(() => {
    return (cities || []).map((city) => ({
      label: getLocalizedName(city.name, lang),
      value: city.id,
    }));
  }, [cities]);

  const addressTypeOptions = useMemo(() => [
    { label: t("addresses.types.shipping", "Shipping"), value: "shipping" },
    { label: t("addresses.types.billing", "Billing"), value: "billing" },
    { label: t("addresses.types.both", "Both"), value: "both" },
  ], [t]);

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={closeModal}
      action={
        <ActionButtons
          closeModal={closeModal}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          formRef={formRef}
          t={t}
        />
      }
      title={
        isEditMode
          ? t("addresses.editAddress", "Edit Address")
          : t("addresses.addNewAddress", "Add New Address")
      }
      description={t("addresses.modalDescription", "Enter delivery address details for your orders")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-4 py-3">
          {/* Country & City Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="country_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("addresses.country", "Country")}
                  disabled={isSubmitting}
                  placeholder={t("addresses.selectCountry", "Select Country...")}
                  options={countryOptions}
                  value={field.value ? String(field.value) : ""}
                  onChange={(val) => {
                    field.onChange(Number(val));
                    setValue("city_id", ""); // إعادة تعيين المدينة عند تغيير الدولة
                    fetchCities(Number(val));
                  }}
                  error={errors.country_id?.message}
                />
              )}
            />

            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("addresses.city", "City")}
                  disabled={isSubmitting || !selectedCountryId || isLoadingCities}
                  placeholder={t("addresses.selectCity", "Select City...")}
                  options={cityOptions}
                  value={field.value ? String(field.value) : ""}
                  onChange={(val) => field.onChange(Number(val))}
                  error={errors.city_id?.message}
                />
              )}
            />
          </div>

          {/* Address Type & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("addresses.type", "Address Type")}
                  disabled={isSubmitting}
                  placeholder={t("addresses.selectType", "Select Type...")}
                  options={addressTypeOptions}
                  value={field.value || "shipping"}
                  onChange={field.onChange}
                  error={errors.type?.message}
                />
              )}
            />

            <Input
              label={t("addresses.phoneContact", "Phone Contact")}
              placeholder="01012345678"
              icon={<Phone size={16} />}
              error={errors.phone_contact?.message}
              {...register("phone_contact")}
            />
          </div>

          {/* Street Details */}
          <Input
            label={t("addresses.streetDetails", "Street Details")}
            placeholder={t("addresses.streetPlaceholder", "e.g. 15 Ahmed Orabi St")}
            icon={<MapPin size={16} />}
            error={errors.street_details?.message}
            {...register("street_details")}
          />

          {/* Area & Building Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("addresses.area", "Area / District")}
              placeholder={t("addresses.areaPlaceholder", "e.g. Maadi")}
              icon={<Home size={16} />}
              error={errors.area?.message}
              {...register("area")}
            />

            <Input
              label={t("addresses.buildingNumber", "Building / Apt No.")}
              placeholder="e.g. Building 12, Apt 4"
              icon={<Building size={16} />}
              error={errors.building_number?.message}
              {...register("building_number")}
            />
          </div>

          {/* Is Default Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <Controller
              name="is_default"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="is_default"
                  checked={!!field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              )}
            />
            <label htmlFor="is_default" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              {t("addresses.setAsDefault", "Set as default address")}
            </label>
          </div>
        </div>
      </form>
    </BaseModel>
  );
}