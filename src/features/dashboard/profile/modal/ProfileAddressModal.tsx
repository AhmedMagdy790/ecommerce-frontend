import React, { useEffect, useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useLang } from "@/shared/context/LanguageContext";
import { Input } from "@/shared/components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModel from "@/shared/components/BaseModal";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { addressSchema, updateAddressSchema } from "../schema/addressSchema";
import { useAddressStore } from "../store/useAddressStore";
import { type IModal } from "@/shared/types/types";
import { useCountryStore } from "@/features/dashboard/country/store/useCountryStore";
import { type ICountry } from "@/features/dashboard/country/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { useCityStore } from "@/features/dashboard/city/store/useCityStore";
import { type ICity } from "@/features/dashboard/city/types";
import { Button } from "@/shared/components/Button";
import type { IAddressPayload } from "../types/profileTypes";

const typeOptions = [
  { label: "🏠 Home", value: "home" },
  { label: "💼 Work", value: "work" },
  { label: "📍 Other", value: "other" }
];

export default function ProfileAddressModal({ isOpen, closeModal, addressToEdit }: IModal ) {
  const { createAddAddress, updateAddress, isLoading } = useAddressStore();
  const { countries, fetchCountries } = useCountryStore();
  const { show, hide } = useStatusStore();
  const { lang } = useLang();
  const { fetchCities, cities, loading: loadingCity } = useCityStore();

   const formRef = useRef(null);

  const isEdit = !!addressToEdit;



  const { register, handleSubmit, watch, control, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(isEdit ? updateAddressSchema : addressSchema),
    defaultValues: { type: "home", is_default: false }
  });


  useEffect(() => {
    if (addressToEdit) {
      reset({
        country_id: addressToEdit.country_id,
        city_id: addressToEdit.city_id,
        type: addressToEdit.type,
        area: addressToEdit.area,
        street_details: addressToEdit.street_details,
        building_number: addressToEdit.building_number,
        phone_contact: addressToEdit.phone_contact,
        is_default: addressToEdit.is_default,
      });
    } else {
      reset({
        type: "home",
        is_default: false,
      });
    }
  }, [addressToEdit, reset]);


  
  const selectedCountryId = watch("country_id");

  useEffect(() => {
    const initFetch = async () => {
     
      await fetchCountries();
    };

    initFetch();
  }, [fetchCountries]);

  useEffect(() => {


    if (selectedCountryId) {
      fetchCities(selectedCountryId);
    }

  }, [selectedCountryId]);


  const countryOptions = useMemo(() => {
    return countries.map((country: ICountry) => ({
      label: lang === "ar" ? country.name.ar : country.name.en,
      value: country.id.toString()
    }));
  }, [countries, lang]);

  const citiesOptions = useMemo(() => {
    return cities.map((city: ICity) => ({
      label: lang === "ar" ? city.name.ar : city.name.en,
      value: city.id.toString()
    }));
  }, [cities, lang]);




  const onSubmit = async (data: IAddressPayload) => {
    let result = false;
    try {
      show("loading", isEdit ? "جاري التعديل..." : "جاري الإضافة...");

      console.log(data)

      if (isEdit) {
        result = await updateAddress(addressToEdit.id, data);

      } else {
        result = await createAddAddress(data);
      }
      
      
      if(result) {
        closeModal();
        show("success", isEdit ? "تم التعديل" : "تم الإضافة");
      }
      setTimeout(() => hide(), 1200);
    } catch (error) {
      show("error", "حدث خطأ ما");
    }
  };



  const ActionButtons = () => {
    return (
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={closeModal}
          className="text-sm"
        >
          Cancel
        </Button>

        <Button
          variant={isEdit ? "update" : "primary"}
          onClick={() => formRef?.current?.requestSubmit()}
          type="submit"
        >
          {isLoading
            ? "Saving..."
            : isEdit
            ? "Update Address"
            : "Save Address"}
        </Button>
      </div>
    );
  };



  return (
    <BaseModel
      title={isEdit ? "تعديل العنوان" : "إضافة عنوان"}
      isOpen={isOpen} 
      closeModal={closeModal}
      isLoading={isLoading}
      action={<ActionButtons />}
      description={
        isEdit
          ? "قم بتعديل بيانات العنوان"
          : "أضف عنوان شحن جديد"
      }
    >


      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ fontFamily: 'var(--font-outfit)' }}>
        
        <div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-2 pb-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 p-2">

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Address Type"
                  options={typeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.type?.message}
                />
              )}
            />




            <Controller
              name="country_id"
              disabled={!watch("country_id")}
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Country"
                  placeholder="Select country..."
                  options={countryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.country_id?.message}
                />
              )}
            />


 
            {/* المدينة */}
            <Controller
              name="city_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="City"
                  disabled={!field.value}
                  placeholder="Select city..."
                  options={citiesOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.city_id?.message}
                />
              )}
            />


            {/* استخدام المكون الجاهز Input مع تمرير المتغيرات */}
            <Input label="Area" placeholder="مثال: مدينة نصر" {...register("area")} error={errors.area?.message} />

            <div className="lg:col-span-2">
              <Input label="Street Details" placeholder="Street name / Landmarks" {...register("street_details")} error={errors.street_details?.message} />
            </div>

            <Input label="Building Number" placeholder="e.g. 12" {...register("building_number")} error={errors.building_number?.message} />
            <Input label="Contact Phone" placeholder="+20..." {...register("phone_contact")} error={errors.phone_contact?.message} />

            {/* تعيين كافتراضي - Checkbox مخصص */}
            <div className="lg:col-span-2 flex items-center gap-3 py-2">
              <input 
                type="checkbox" 
                id="is_default" 
                {...register("is_default")} 
                className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 cursor-pointer" 
              />
              <label htmlFor="is_default" className="text-theme-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Set as default shipping address
              </label>
            </div>
          </div>
        </div>


      </form>
    </BaseModel>
  );
}