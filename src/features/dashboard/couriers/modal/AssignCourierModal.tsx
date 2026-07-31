import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BaseModel from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import CustomSelect from "@/shared/components/CustomSelect";

import { cityService } from "@/features/dashboard/city/services/cityService";
import { countryService } from "@/features/dashboard/country/services/countryService";
import { useShippingCityStore } from "../store/useShippingCityStore";

import { type IShippingCity } from "../types/types";
import { type ShippingCityFormData, shippingCitySchema } from "../schema/shippingCourierSchema";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  city?: IShippingCity | null;
  courierOptions: { label: string; value: number }[];
}

export default function AssignCourierModal({ isOpen, closeModal, city, courierOptions = [] }: Props) {
  // الاعتماد الكامل على الـ Store المحدث لإدارة الـ Loading والـ HTTP Actions
  const { assignCity, updateCity, isLoading: isStoreLoading } = useShippingCityStore();

  const [countries, setCountries] = useState<{ label: string; value: number }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: number }[]>([]);
  const [isFetchingCities, setIsFetchingCities] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShippingCityFormData>({
    resolver: zodResolver(shippingCitySchema),
    defaultValues: {
      country_id: undefined,
      city_id: undefined,
      courier_id: undefined,
      // shipping_cost: 0,
      is_active: true,
    },
  });

  const selectedCountry = watch("country_id");

  // ==========================================
  // 1. التحميل والمزامنة الأولية الآمنة
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;

    const initializeData = async () => {
      try {
        const countryRes = await countryService.getAll();
        setCountries(countryRes.map((c: any) => ({ label: c.name, value: c.id })));

        if (city) {
          const targetCountryId = city.country_id || (city as any).city?.country_id;
          
          if (targetCountryId) {
            const cityRes = await cityService.getByCountry(targetCountryId);
            setCities(cityRes.map((c: any) => ({ label: c.name, value: c.id })));
          }

          // قراءة البيانات بشكل مرن يدعم الـ Flat والـ Nested Response من السيرفر
          reset({
            country_id: targetCountryId,
            city_id: city.city_id || (city as any).id,
            courier_id: city.courier_id || city.shipping_courier_id || undefined,
            // shipping_cost: city.shipping_cost || (city as any).base_cost || (city as any).shipping_fee || 0,
            is_active: city.is_active,
          });
        } else {
          setCities([]);
          reset({
            country_id: undefined,
            city_id: undefined,
            courier_id: undefined,
            // shipping_cost: 0,
            is_active: true,
          });
        }
      } catch (err) {
        console.error("Failed to initialize modal data:", err);
      }
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, city, reset]);

  // ==========================================
  // 2. مراقبة تغيير الدولة يدوياً
  // ==========================================
  useEffect(() => {
    if (isOpen && selectedCountry) {
      // const currentCountryId = city?. || (city as any).city?.country_id;
      // if (city && selectedCountry === currentCountryId && cities.length > 0) {
      //   return; 
      // }

      setIsFetchingCities(true);
      cityService
        .getByCountry(selectedCountry)
        .then((res) => {
          setCities(res.map((c: any) => ({ label: c.name, value: c.id })));
          setValue("city_id", undefined as any);
        })
        .catch((err) => console.error(err))
        .finally(() => setIsFetchingCities(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, isOpen, setValue]);

  // =========================
  // Submission Pipeline
  // =========================
  const onSubmit = async (data: ShippingCityFormData) => {
      // الدمج لضمان إرسال القيم حتى لو كانت الـ Inputs معطلة
      const payload = {
        country_id: city?.country_id || data.country_id,
        city_id: city?.city_id || (city as any).id || data.city_id,
        courier_id: city?.shipping_courier_id || city?.courier_id || data.courier_id,
        is_active: data.is_active,
      };

      try {
        if (city) {
          const targetCityId = city.city_id || (city as any).id;
          await updateCity(targetCityId, payload);
        } else {
          await assignCity(payload);
        }
        closeModal();
      } catch (err) {
        console.error("Submission failed:", err);
      }
  };

  const Actions = () => (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="secondary" onClick={closeModal}>
        Cancel
      </Button>

      <Button
        type="submit"
        variant={city ? "update" : "primary"}
        disabled={isStoreLoading}
        onClick={() => formRef.current?.requestSubmit()}
      >
        {isStoreLoading ? "Saving..." : city ? "Update" : "Assign"}
      </Button>
    </div>
  );
  

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isStoreLoading}
      closeModal={closeModal}
      action={<Actions />}
      title={city ? "تعديل المدينة" : "تعيين مدينة لشركة شحن"}
      description="حدد شركة الشحن وتكلفة الشحن للمدينة"
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5 py-4">
          
          {/* Country Selector */}
          <Controller
            name="country_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Country"
                placeholder="Select Country"
                options={countries}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.country_id?.message}
                disabled={!!city} 
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
                placeholder={isFetchingCities ? "Loading cities..." : "Select City"}
                options={cities}
                disabled={!selectedCountry || isFetchingCities || !!city}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.city_id?.message}
              />
            )}
          />

          {/* Courier Selector */}
          <Controller
            name="courier_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Courier"
                placeholder="Select Courier"
                options={courierOptions}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.courier_id?.message}
                disabled={!!city}
              />
            )}
          />

          {/* Shipping Cost */}
          {/* <Input
            type="number"
            label="Shipping Cost"
            {...register("shipping_cost", { valueAsNumber: true })} // تأمين تحويل القيمة لرقم لعدم تضارب الكاستينج بالـ Zod
            error={errors.shipping_cost?.message}
          /> */}
          
        </div>
      </form>
    </BaseModel>
  );
}