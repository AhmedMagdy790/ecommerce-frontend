// src/features/shipping/components/ShippingRateModal.tsx

import { useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import { DollarSign, Clock, Weight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { ActionButtons } from "@/shared/components/ActionButtons";
import type { ShippingRate } from "../../model/types/rate.types";
import { useShippingRateForm } from "../../hooks/useShippingRateForm";
import { useShippingRateOptions } from "../../hooks/useShippingRateOptions";

interface IShippingRateModal extends IModal {
  rate?: ShippingRate<TranslatedText> | null;
}

export default function ShippingRateModal({ isOpen, closeModal, rate }: IShippingRateModal) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode,
  } = useShippingRateForm(rate, closeModal, isOpen);

  const {
    control,
    register,
    setValue, // لاستخدامها في تصفير المدينة عند تغيير الدولة
    formState: { errors },
  } = methods;

  const {
    countryOptions,
    cityOptions,
    courierOptions,
    isCountriesLoading,
    isCitiesLoading,
    isCouriersLoading,
    selectedCountryId,
    handleCountryChange,
  } = useShippingRateOptions(rate?.city?.country_id);

  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "Active")}`, value: true },
    { label: `🔴 ${t("status.inactive", "Inactive")}`, value: false },
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
          ? t("shipping.editRate", "Edit Shipping Rate")
          : t("shipping.addNewRate", "Add New Shipping Rate")
      }
      description={t("shipping.rateModalDescription", "Configure country/city-based shipping fees, delivery times, and weight limits")}
      maxWidth="max-w-2xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              label={t("country.select", "Country")}
              disabled={isSubmitting || isCountriesLoading}
              placeholder={isCountriesLoading ? t("common.loading", "Loading...") : t("country.selectPlaceholder", "Select Country...")}
              options={countryOptions}
              value={selectedCountryId ?? ""}
              onChange={(countryId) => {

                handleCountryChange(Number(countryId));
                setValue("city_id", 0);
              }}
              error={errors.city_id?.message}
            />

            {/* 2. اختيار شركة الشحن */}
            <Controller
              name="shipping_courier_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("shipping.courier", "Courier")}
                  disabled={isSubmitting || isCouriersLoading}
                  placeholder={isCouriersLoading ? t("common.loading", "Loading...") : t("shipping.selectCourier", "Select Courier...")}
                  options={courierOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.shipping_courier_id?.message}
                />
              )}
            />
          </div>

          {/* 3. اختيار المدينة (يعتمد على الدولة المحددة) */}
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("shipping.city", "City")}
                  disabled={isSubmitting || isCitiesLoading}
                  placeholder={isCitiesLoading ? t("common.loading", "Loading...") : t("shipping.selectCity", "Select City...")}
                  options={cityOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.city_id?.message}
                />
              )}
            />
          </div>

          <hr className="border-[var(--color-border)] my-2" />

          {/* بقية الحقول: الرسوم، الأوزان، وقت التوصيل... الخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              label={t("shipping.fee", "Shipping Fee")}
              placeholder="0.00"
              error={errors.shipping_fee?.message}
              icon={<DollarSign size={16} />}
              {...register("shipping_fee", { valueAsNumber: true })}
            />

            <Input
              type="number"
              step="0.01"
              label={t("shipping.codFee", "COD Fee")}
              placeholder="0.00"
              error={errors.cod_fee?.message}
              icon={<DollarSign size={16} />}
              {...register("cod_fee", { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label={t("shipping.deliveryFrom", "Estimated Delivery From (Days)")}
              placeholder="1"
              error={errors.estimated_delivery_from?.message}
              icon={<Clock size={16} />}
              {...register("estimated_delivery_from", { valueAsNumber: true })}
            />

            <Input
              type="number"
              label={t("shipping.deliveryTo", "Estimated Delivery To (Days)")}
              placeholder="3"
              error={errors.estimated_delivery_to?.message}
              icon={<Clock size={16} />}
              {...register("estimated_delivery_to", { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              step="0.01"
              label={t("shipping.baseCost", "Base Cost")}
              placeholder="0.00"
              {...register("base_cost", { valueAsNumber: true })}
              error={errors.base_cost?.message}
            />

            <Input
              type="number"
              step="0.01"
              label={t("shipping.baseWeight", "Base Weight (KG)")}
              placeholder="1.0"
              icon={<Weight size={16} />}
              {...register("base_weight", { valueAsNumber: true })}
              error={errors.base_weight?.message}
            />

            <Input
              type="number"
              step="0.01"
              label={t("shipping.extraPerKg", "Extra Per KG")}
              placeholder="0.00"
              {...register("extra_per_kg", { valueAsNumber: true })}
              error={errors.extra_per_kg?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              step="0.01"
              label={t("shipping.maxWeight", "Max Weight (KG)")}
              placeholder="Optional"
              {...register("max_weight", { valueAsNumber: true })}
              error={errors.max_weight?.message}
            />

            <Input
              type="number"
              step="0.01"
              label={t("shipping.freeThreshold", "Free Shipping Threshold")}
              placeholder="Optional"
              {...register("free_shipping_threshold", { valueAsNumber: true })}
              error={errors.free_shipping_threshold?.message}
            />

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("common.status", "Status")}
                  disabled={isSubmitting}
                  placeholder={t("common.selectStatus", "Select Status...")}
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.is_active?.message}
                />
              )}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}