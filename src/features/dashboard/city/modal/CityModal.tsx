import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModel from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { useCityStore } from "../store/useCityStore";
import { useCountryStore } from "@/features/dashboard/country/store/useCountryStore";
import { type CityFormData, citySchema } from "../schema/citySchema";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { type ICity } from "../types";
import CustomSelect from "@/shared/components/CustomSelect";
import { useLang } from "@/shared/context/LanguageContext";
import { type ICountry } from "@/features/dashboard/country/types";
import { Button } from "@/shared/components/Button";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  selectedCity: ICity | null;
  defaultCountryId: number | string | null;
}

export default function CityModal({ isOpen, closeModal, selectedCity, defaultCountryId }: Props) {
  const { fetchCities, createCity, updateCity, addShippingRate } = useCityStore();
  const { countries, fetchCountries } = useCountryStore();
  const { show, hide } = useStatusStore();
  const { lang } = useLang();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, setError, control, setValue, reset, handleSubmit, formState: { errors } } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: { is_active: true }
  });

  useEffect(() => {
    if (isOpen && fetchCountries) fetchCountries();
  }, [isOpen, fetchCountries]);

  useEffect(() => {
    if (selectedCity) {
      reset({
        name_ar: typeof selectedCity.name === 'string' ? selectedCity.name : selectedCity.name?.ar || "",
        name_en: typeof selectedCity.name === 'string' ? selectedCity.name : selectedCity.name?.en || "",
        country_id: Number(selectedCity.country_id || defaultCountryId || 0),
        city_code: selectedCity.city_code || "",
        is_active: Boolean(selectedCity.is_active),
      });
    } else {
      reset({ 
        name_ar: "", 
        name_en: "", 
        country_id: defaultCountryId ? Number(defaultCountryId) : 0, 
        city_code: "", 
        is_active: true,
        shipping_cost: undefined,
        delivery_time: ""
      });
    }
  }, [selectedCity, defaultCountryId, reset]);

  const countryOptions = useMemo(() => {
    return (countries || []).map((country: ICountry) => {
      const countryName = typeof country.name === 'string' 
        ? country.name 
        : country.name?.[lang] || country.name?.ar || country.name?.en || "";
      return {
        label: countryName,
        value: country.id.toString()
      };
    });
  }, [countries, lang]);

  useEffect(() => {
    if (defaultCountryId) {
      setValue('country_id', Number(defaultCountryId));
    }
  }, [defaultCountryId, setValue]);

  const onSubmit = async (data: CityFormData) => {
    try {
      setIsSubmitting(true);

      const payload = {
        name: { ar: data.name_ar, en: data.name_en },
        country_id: Number(data.country_id),
        city_code: data.city_code,
        is_active: data.is_active,
      };

      let cityResponse;

      if (selectedCity?.id) {
        cityResponse = await updateCity(selectedCity.id, payload);
      } else {
        cityResponse = await createCity(payload);
        
        if (data.shipping_cost && cityResponse?.id && addShippingRate) {
          await addShippingRate(cityResponse.id, {
            cost: Number(data.shipping_cost),
            delivery_time: data.delivery_time || "3-5 days"
          });
        }
      }

      if (fetchCities && data.country_id) {
        await fetchCities(Number(data.country_id));
      }
      
      closeModal();
      reset();
    } catch (error: any) {
      handleServerErrors(error, setError, ['name_ar', 'name_en', 'country_id', 'city_code']);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => hide(), 1500);
    }
  };

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={closeModal}
      title={selectedCity ? (lang === "ar" ? "تعديل بيانات المدينة" : "Edit City") : (lang === "ar" ? "إضافة مدينة جديدة" : "Add New City")}
      description={lang === "ar" ? "أدخل تفاصيل المدينة وحدد سعر الشحن الافتراضي لها." : "Enter city details and default shipping cost."}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" style={{ fontFamily: 'var(--font-outfit)' }}>
        
        <div className="grid grid-cols-1 gap-5">
          
          {/* اختيار الدولة */}
          <div className="flex flex-col gap-2">
            <Controller 
              name="country_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                    label={lang === "ar" ? "الدولة" : "Country"}
                    value={field.value ? field.value.toString() : ""}
                    onChange={(val) => field.onChange(Number(val))}
                    placeholder={lang === "ar" ? "اختر الدولة..." : "Select country..."}
                    options={countryOptions}
                    error={errors.country_id?.message}
                />
              )}
            />      
          </div>

          {/* أسماء المدينة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={lang === "ar" ? "الاسم (بالعربية)" : "Arabic Name"} 
              {...register("name_ar")} 
              error={errors.name_ar?.message} 
              placeholder={lang === "ar" ? "مثال: القاهرة" : "e.g. Cairo"} 
            />
            <Input 
              label={lang === "ar" ? "Name (English)" : "English Name"} 
              {...register("name_en")} 
              error={errors.name_en?.message} 
              placeholder="Example: Cairo" 
            />
          </div>

          <Input 
            label={lang === "ar" ? "كود المدينة" : "City Code"} 
            {...register("city_code")} 
            error={errors.city_code?.message} 
            placeholder="مثال: CAI" 
          />

          <hr className="border-[var(--color-border)]" />

          {/* قسم الشحن */}
          <div className="bg-[var(--color-primary)]/5 p-4 rounded-[var(--radius-xl)] space-y-4 border border-[var(--color-primary)]/10">
             <h4 className="text-xs font-bold text-[var(--color-primary)]">
                {lang === "ar" ? "إعدادات الشحن الافتراضية" : "Default Shipping Settings"}
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  type="number"
                  label={lang === "ar" ? "تكلفة الشحن" : "Shipping Cost"} 
                  {...register("shipping_cost")} 
                  placeholder="0.00"
                />
                <Input 
                  label={lang === "ar" ? "مدة التوصيل" : "Delivery Time"} 
                  {...register("delivery_time")} 
                  placeholder={lang === "ar" ? "مثال: 2-4 أيام" : "e.g. 2-4 days"}
                />
             </div>
          </div>

          {/* حالة التفعيل */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              id="is_active" 
              {...register("is_active")} 
              className="w-5 h-5 rounded-[var(--radius-sm)] border-[var(--color-border)] text-[var(--color-primary)] accent-[var(--color-primary)] cursor-pointer" 
            />
            <span className="text-sm text-[var(--color-text-secondary)] font-medium">
              {lang === "ar" ? "تفعيل هذه المدينة في خيارات الشحن" : "Activate this city for shipping options"}
            </span>
          </label>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={closeCodeModalSafety => closeModal()}
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (lang === "ar" ? "جاري المعالجة..." : "Processing...") : (lang === "ar" ? "حفظ البيانات" : "Save Data")}
          </Button>
        </div>
      </form>
    </BaseModel>
  );
}