import React, { useEffect, useRef, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BaseModel from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import CustomSelect from "@/shared/components/CustomSelect";

import { useLang } from "@/shared/context/LanguageContext";
import { useShippingRateStore } from "../store/useShippingRateStore";
import { useShippingCourierStore } from "../store/useShippingCourierStore";

import {
  shippingRateSchema,
  type ShippingRateFormData,
} from "../schema/shippingCourierSchema";

import { type IShippingRate } from "../types/types";
import { useCityStore } from "@/features/dashboard/city/store/useCityStore";
import { useCountryStore } from "@/features/dashboard/country/store/useCountryStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  rate?: IShippingRate | null;
}

export default function ShippingRateModal({ isOpen, closeModal, rate }: Props) {
  const { lang } = useLang();
  const formRef = useRef<HTMLFormElement>(null);

  // Stores
  const { createRate, setRate, isLoading } = useShippingRateStore();
  const { countries, fetchCountriesForAdmin, loading: isLoadingCountry } = useCountryStore();
  const { cities, fetchCities, loading: isLoadingCity } = useCityStore();
  const { items: shippingCouriers, fetchShippingCouriers } = useShippingCourierStore();


  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<ShippingRateFormData>({
    resolver: zodResolver(shippingRateSchema),
    defaultValues: {
      id: null,
      shipping_courier_id: undefined,
      estimated_delivery_from: 1,
      estimated_delivery_to: 3,
      shipping_fee: 0,
      free_shipping_threshold: 0,
      max_weight: 0,
      city_id: undefined,
      country_id: undefined,
      base_cost: 0,
      cod_fee: 0,
      base_weight: 0,
      extra_per_kg: 0,
      is_active: true,
    },
  });

  const countryId = watch("country_id");


  // ==========================================
  // 1. المزامنة والتحميل الموحد (Unified Lifecycle Management)
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    const initializeModalData = async () => {
      // جلب البيانات الأساسية للقوائم أولاً بالتوازي
      await Promise.all([
        fetchCountriesForAdmin(),
        fetchShippingCouriers(),
      ]);
      
      if (rate) {
        const targetCountryId = rate?.country?.id;

        
        if (targetCountryId) {
            await fetchCities(targetCountryId);
        }


        reset({
            id: rate.id,
            shipping_courier_id: rate.courier?.id,
            country_id: targetCountryId,
            city_id: rate.city?.id,
            
            estimated_delivery_from: rate.delivery_time?.from || 1,
            estimated_delivery_to: rate.delivery_time?.to || 3,
            shipping_fee: rate.fees?.shipping_fee || 0,
            base_cost: rate.fees?.base_cost || 0,
            cod_fee: rate.fees?.cod_fee || 0,
            base_weight: rate.settings?.base_weight || 0,
            max_weight: rate.settings?.max_weight || 0,
            extra_per_kg: rate.fees?.extra_per_kg || 0,
            free_shipping_threshold: rate.settings?.free_shipping_threshold || 0,
            is_active: rate.settings?.is_active ?? true,
        });
      }
    };

    initializeModalData();
  }, [isOpen, rate, reset]);


  // ==========================================
  // 2. مراقبة تغيير الدولة يدوياً فقط (User Manual Change)
  // ==========================================
  useEffect(() => {
    // نطلق جلب المدن فقط إذا كان هناك CountryId والمودال مفتوح ومستقر
    if (isOpen && countryId) {
      fetchCities(countryId);
    }
  }, [countryId, isOpen]);


  // Options Memoization
  const courierOptions = useMemo(
    () => (shippingCouriers ?? []).map((c) => ({ label: c.name, value: Number(c.id) })),
    [shippingCouriers]
  );

  const countryOptions = useMemo(
      () =>
        (countries ?? []).map((c) => ({
          label: typeof c.name === "object" ? c.name[lang] || c.name.en || "" : String(c.name || ""),
          value: Number(c.id),
        })),
      [countries, lang]
    );

  const cityOptions = useMemo(
    () =>
      (cities ?? []).map((c) => ({
        label: typeof c.name === "object" ? c.name[lang] || c.name.en || "" : String(c.name || ""),
        value: Number(c.id),
      })),
    [cities, lang]
  );

  const onSubmit = async (data: ShippingRateFormData) => {
    try {
      if (!data.city_id) return;
      let success;


      if (rate && rate.id) {
        // التعديل هنا: تمرير (cityId, rateId, payload)
        success = await setRate(data.city_id, rate.id, data);
      } else {
        // لإنشاء سجل جديد (باستخدام دالة createRate المنفصلة التي أنشأناها في الـ Store)
        success = await createRate(data.city_id, data);
      }

      if (success) closeModal();
    } catch (error) {
      handleServerErrors(error, setError, [
        "shipping_courier_id",
        "estimated_delivery_from",
        "estimated_delivery_to",
        "shipping_fee",
        "free_shipping_threshold",
        "max_weight",
        "city_id",
        "country_id",
        "base_cost",
        "cod_fee",
        "base_weight",
        "extra_per_kg",
        "is_active",
      ]);
    }
  };

  const Actions = () => (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="secondary" onClick={closeModal}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant={rate ? "update" : "primary"}
        disabled={isLoading}
        onClick={() => formRef.current?.requestSubmit()}
      >
        {isLoading ? "Saving..." : rate ? "Update Rate" : "Create Rate"}
      </Button>
    </div>
  );

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isLoading || isLoadingCountry || isLoadingCity}
      closeModal={closeModal}
      action={<Actions />}
      title={rate ? "تعديل تسعيرة الشحن" : "إضافة تسعيرة شحن"}
      description="حدد شركة الشحن + المدينة + التكلفة"
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        {/* أضفنا سكرول للمودال لضمان عدم خروج الحقول الكثيرة عن شاشة العرض كأفضل ممارسة UX */}
        <div className="custom-scrollbar max-h-[65vh] overflow-y-auto pr-1 space-y-5 py-4">
          
          {/* Courier Selector */}
          <Controller
            name="shipping_courier_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Courier"
                options={courierOptions}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.shipping_courier_id?.message}
                disabled={!!rate}
              />
            )}
          />

          {/* Country Selector */}
          <Controller
            name="country_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Country"
                options={countryOptions}
                value={field.value || ""}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("city_id", undefined); // تصفير المدينة فوراً عند تغيير الدولة يدوياً
                }}
                disabled={!!rate}
                error={errors.country_id?.message}
              />
            )}
          />

          {/* City Selector */}
          <Controller
            name="city_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="City"
                options={cityOptions}
                value={field.value || ""}
                onChange={field.onChange}
                disabled={!!rate || !countryId}
                error={errors.city_id?.message}
              />
            )}
          />

          {/* الحقول المالية والمقاييس - قمنا بإزالة valueAsNumber وتركنا المهمة لـ Schema */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Base Cost"
              {...register("base_cost")}
              error={errors.base_cost?.message}
            />
            <Input
              type="number"
              label="COD Fee"
              {...register("cod_fee")}
              error={errors.cod_fee?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Shipping Fee"
              {...register("shipping_fee")}
              error={errors.shipping_fee?.message}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                label="Delivery From"
                {...register("estimated_delivery_from")}
                error={errors.estimated_delivery_from?.message}
              />
              <Input
                type="number"
                label="Delivery To"
                {...register("estimated_delivery_to")}
                error={errors.estimated_delivery_to?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Free Shipping Threshold"
              {...register("free_shipping_threshold")}
              error={errors.free_shipping_threshold?.message}
            />
            <Input
              type="number"
              label="Max Weight"
              {...register("max_weight")}
              error={errors.max_weight?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Base Weight"
              {...register("base_weight")}
              error={errors.base_weight?.message}
            />
            <Input
              type="number"
              label="Extra per KG"
              {...register("extra_per_kg")}
              error={errors.extra_per_kg?.message}
            />
          </div>

        </div>
      </form>
    </BaseModel>
  );
}