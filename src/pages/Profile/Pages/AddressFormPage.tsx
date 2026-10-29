import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, MapPin, LoaderCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ROUTES } from "@/constants/navigation";
import { useLang } from "@/shared/context/LanguageContext";
import { useAddressPage } from "@/features/address/hooks/useAddressPage";
import {
  addressSchema,
  type AddressFormData,
  type AddressFormInput,
} from "@/features/address/model/schema/addressSchema";
import { useCountryOptions } from "@/features/country/hooks/useCountryOptions";
import { useCityOptions } from "@/features/city/dashboard/hook/useCityOptions";
import CustomSelect from "@/shared/components/CustomSelect";

export default function AddressFormPage() {
  const navigate = useNavigate();
  const { t } = useTranslation("address");
  const { isRTL } = useLang();

  const { createAddress, isSubmitting, error } = useAddressPage();

  const {
    register,
    watch,
    control,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormInput, unknown, AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: "home",
      street_details: "",
      is_default: false,
    },
  });

  const { countryOptions, isCountriesLoading, error: countriesError } = useCountryOptions();

  const selectedCountryId = watch("country_id");
  const countryId =
    selectedCountryId != null && selectedCountryId !== ""
      ? Number(selectedCountryId)
      : undefined;

  const {
    cityOptions,
    isCitiesLoading,
    error: citiesError,
  } = useCityOptions(
    countryId !== undefined && Number.isFinite(countryId) ? countryId : undefined
  );

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const generalError = error || countriesError || citiesError;

  const fieldClass =
    "mt-1.5 w-full rounded-control border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClass = "block text-sm font-medium text-text-primary";
  const errorClass = "mt-1 text-xs text-red-600";

  const typeOptions = [
    { value: "home", label: t("types.home", { defaultValue: "Home" }) },
    { value: "work", label: t("types.work", { defaultValue: "Work" }) },
    { value: "office", label: t("types.office", { defaultValue: "Office" }) },
    { value: "other", label: t("types.other", { defaultValue: "Other" }) },
  ];

  const onSubmit = async (values: AddressFormData) => {
    const success = await createAddress(values);
    if (success) {
      navigate(ROUTES.SETTINGS_ADDRESSES, { replace: true });
    }
  };

  return (
    <main className="min-h-[80vh] bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to={ROUTES.SETTINGS_ADDRESSES}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <BackIcon className="size-4" aria-hidden="true" />
          {t("backToAddresses", { defaultValue: "Back to addresses" })}
        </Link>

        <header className="mb-6 mt-6">
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary">
            <MapPin className="size-5" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {t("form.createTitle", { defaultValue: "Add new address" })}
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {t("form.description", {
              defaultValue: "Enter your address details for delivery.",
            })}
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-panel border border-border bg-surface p-4 shadow-sm sm:p-6 lg:p-8"
        >
          {generalError && (
            <div
              role="alert"
              className="rounded-control border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600"
            >
              {generalError}
            </div>
          )}

          {/* Address Type Select */}
          <div>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("form.type", { defaultValue: "Address type" })}
                  options={typeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.type?.message}
                  searchStatus={false}
                />
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Country Select */}
            <div>
              <Controller
                name="country_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label={t("form.country", { defaultValue: "Country" })}
                    options={countryOptions}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      resetField("city_id", { defaultValue: undefined });
                    }}
                    placeholder={
                      isCountriesLoading
                        ? t("loading", { defaultValue: "Loading..." })
                        : t("form.selectCountry", { defaultValue: "Select country" })
                    }
                    disabled={isCountriesLoading}
                    error={errors.country_id?.message}
                    searchStatus={true}
                  />
                )}
              />
            </div>

            {/* City Select */}
            <div>
              <Controller
                name="city_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label={t("form.city", { defaultValue: "City" })}
                    options={cityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      isCitiesLoading
                        ? t("loading", { defaultValue: "Loading..." })
                        : t("form.selectCity", { defaultValue: "Select city" })
                    }
                    disabled={!countryId || isCitiesLoading}
                    error={errors.city_id?.message}
                    searchStatus={true}
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label htmlFor="area" className={labelClass}>
              {t("form.area", { defaultValue: "Area / District" })}
            </label>

            <input
              id="area"
              {...register("area")}
              className={fieldClass}
              placeholder={t("form.areaPlaceholder", {
                defaultValue: "Area or district",
              })}
            />

            {errors.area && <p className={errorClass}>{errors.area.message}</p>}
          </div>

          <div>
            <label htmlFor="street_details" className={labelClass}>
              {t("form.street", { defaultValue: "Street details" })}
            </label>

            <textarea
              id="street_details"
              {...register("street_details")}
              rows={3}
              className={fieldClass}
              placeholder={t("form.streetPlaceholder", {
                defaultValue: "Street name and delivery instructions",
              })}
            />

            {errors.street_details && (
              <p className={errorClass}>{errors.street_details.message}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="building_number" className={labelClass}>
                {t("form.building", { defaultValue: "Building number" })}
              </label>

              <input
                id="building_number"
                {...register("building_number")}
                className={fieldClass}
              />

              {errors.building_number && (
                <p className={errorClass}>{errors.building_number.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone_contact" className={labelClass}>
                {t("form.phone", { defaultValue: "Contact phone" })}
              </label>

              <input
                id="phone_contact"
                {...register("phone_contact")}
                type="tel"
                dir="ltr"
                className={fieldClass}
                placeholder="+201xxxxxxxxx"
              />

              {errors.phone_contact && (
                <p className={errorClass}>{errors.phone_contact.message}</p>
              )}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-control border border-border p-4">
            <input
              {...register("is_default")}
              type="checkbox"
              className="mt-1 size-4 accent-primary"
            />

            <span>
              <span className="block text-sm font-medium text-text-primary">
                {t("form.makeDefault", { defaultValue: "Set as default address" })}
              </span>

              <span className="mt-1 block text-xs leading-5 text-text-secondary">
                {t("form.makeDefaultDescription", {
                  defaultValue: "Use this address by default for delivery.",
                })}
              </span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Link
              to={ROUTES.SETTINGS_ADDRESSES}
              className="inline-flex min-h-11 items-center justify-center rounded-control border border-border px-5 text-sm font-medium text-text-primary hover:bg-surface-secondary"
            >
              {t("cancel", { defaultValue: "Cancel" })}
            </Link>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isCountriesLoading ||
                isCitiesLoading ||
                Boolean(countriesError) ||
                Boolean(citiesError)
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              )}

              {isSubmitting
                ? t("saving", { defaultValue: "Saving..." })
                : t("form.createButton", { defaultValue: "Save address" })}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}