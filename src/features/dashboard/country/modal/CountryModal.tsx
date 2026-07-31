import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModel from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { useCountryStore } from "../store/useCountryStore";
import { type CountryFormData, countrySchema } from "../schema/countrySchema";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { type ICountry } from "../types";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  selectedCountry: ICountry | null;
}

export default function CountryModal({ isOpen, closeModal, selectedCountry }: Props) {
  const { lang } = useLang();
  const { fetchCountriesForAdmin, createCountry, updateCountry } = useCountryStore();
  const { show, hide } = useStatusStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, setError, handleSubmit, formState: { errors }, reset } = useForm<CountryFormData>({
    resolver: zodResolver(countrySchema),
    defaultValues: { is_active: true }
  });

  useEffect(() => {
    if (selectedCountry) {
      const nameAr = typeof selectedCountry.name === 'string' 
        ? selectedCountry.name 
        : selectedCountry.name?.ar || "";
      const nameEn = typeof selectedCountry.name === 'string' 
        ? selectedCountry.name 
        : selectedCountry.name?.en || "";

      reset({
        name_ar: nameAr,
        name_en: nameEn,
        code: selectedCountry.code || "",
        phone_code: selectedCountry.phone_code ? String(selectedCountry.phone_code) : "",
        is_active: Boolean(Number(selectedCountry.is_active)),
      });
    } else {
      reset({ name_ar: "", name_en: "", code: "", phone_code: "", is_active: true });
    }
  }, [selectedCountry, reset]);

  const onSubmit = async (data: CountryFormData) => {
    try {
      setIsSubmitting(true);

      if (selectedCountry?.id) {
        await updateCountry(selectedCountry.id, data);
        show("success", lang === "ar" ? "تم تحديث البيانات بنجاح" : "Data updated successfully");
      } else {
        await createCountry(data);
        show("success", lang === "ar" ? "تم إضافة الدولة بنجاح" : "Country added successfully");
      }

      if (fetchCountriesForAdmin) {
        await fetchCountriesForAdmin();
      }
      reset(); 
      closeModal();
      
    } catch (error: any) {
      show("error", lang === "ar" ? "فشل الحفظ، تأكد من البيانات" : "Save failed, check data");

      handleServerErrors(error, setError, [
        'name_ar',
        'name_en',
        'code',
        "phone_code",
        "is_active"
      ]);
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
      title={selectedCountry ? (lang === "ar" ? "تعديل الدولة" : "Edit Country") : (lang === "ar" ? "إضافة دولة جديدة" : "Add New Country")}
      description={lang === "ar" ? "أدخل بيانات الدولة لضبط إعدادات الشحن والاتصال" : "Enter country details to configure shipping and connection settings"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ fontFamily: 'var(--font-outfit)' }}>
        
        <div className="grid grid-cols-1 gap-5 p-2">
          
          <Input 
            label={lang === "ar" ? "الاسم (العربية)" : "Arabic Name"} 
            {...register("name_ar")} 
            error={errors.name_ar?.message} 
          />

          <Input 
            label={lang === "ar" ? "Name (English)" : "English Name"} 
            {...register("name_en")} 
            error={errors.name_en?.message} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={lang === "ar" ? "الكود (ISO)" : "Code (ISO)"} 
              placeholder="e.g. EG" 
              {...register("code")} 
              error={errors.code?.message} 
            />
            
            <Input 
              label={lang === "ar" ? "كود الهاتف" : "Phone Code"} 
              placeholder="e.g. 20" 
              {...register("phone_code")} 
              error={errors.phone_code?.message} 
            />
          </div>

          <label className="flex items-center gap-3 py-2 px-1 cursor-pointer">
            <input 
              type="checkbox" 
              id="is_active" 
              {...register("is_active")} 
              className="w-5 h-5 rounded-[var(--radius-sm)] border-[var(--color-border)] text-[var(--color-primary)] accent-[var(--color-primary)] cursor-pointer" 
            />
            <span className="text-sm text-[var(--color-text-secondary)] font-medium">
              {lang === "ar" ? "تفعيل الدولة فوراً" : "Activate country immediately"}
            </span>
          </label>
        </div>

        <div className="h-px my-6 bg-[var(--color-border)]" />

        <div className="flex gap-4 justify-end">
          <Button 
             type="button" 
             variant="secondary"
             onClick={closeModal} 
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={isSubmitting} 
          >
            {isSubmitting ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") : (lang === "ar" ? "حفظ البيانات" : "Save Data")}
          </Button>
        </div>
      </form>
    </BaseModel>
  );
}