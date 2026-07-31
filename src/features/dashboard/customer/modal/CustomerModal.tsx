import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BaseModal from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { Button } from "@/shared/components/Button";

import { useCustomerStore } from "../store/useCustomerStore";
import { useCityStore } from "@/features/dashboard/city/store/useCityStore";
import { customerSchema, type CustomerInput } from "../schema/customerSchema";

import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import {type IModal } from "@/shared/types/types";
import { type IUser } from "@/features/dashboard/auth/types/authType";
import { useCountryStore } from "@/features/dashboard/country/store/useCountryStore";
import { useLang } from "@/shared/context/LanguageContext";

interface ICustomerModal extends IModal {
    customer?: IUser | null;
}

export default function CustomerModal({
    isOpen,
    closeModal,
    customer,
}: ICustomerModal) {
    const { addCustomer, updateCustomer, isLoading, error: errorCustomer } = useCustomerStore();
    const { cities, fetchCities, loading: isLoadingCity } = useCityStore();
    const { lang } = useLang();
    const { countries, fetchCountries, loading: isLoadingCountry } = useCountryStore();
    const { show, hide } = useStatusStore.getState();

    const formRef = useRef<HTMLFormElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        watch,
        setValue, // أضفنا setValue لتصفير المدينة عند تغيير الدولة
        formState: { errors },
    } = useForm<CustomerInput>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            street_details: "",
            area: "",
            type: "home",
            city_id: undefined,
            country_id: undefined,
        },
    });

    const selectCountryId = watch("country_id");

    const addres = customer?.addresses?.find((add) => add.is_default)

    // 🧠 تعبئة البيانات عند التعديل
    useEffect(() => {
        if (isOpen) {
            if (customer) {
                reset({
                    name: customer.name,
                    phone: customer.phone,
                    email: customer.email || "",
                    street_details: addres.street_details || "",
                    city_id: addres?.city?.id || 0,
                    country_id: addres?.country?.id || 0,
                    type: customer.type || "home",
                    area: addres.area || "",
                });
            } else {
                reset({
                    name: "",
                    phone: "",
                    email: "",
                    street_details: "",
                    country_id: undefined,
                    city_id: undefined,
                    area: "",
                    type: "home",
                });
            }
        }
    }, [customer, isOpen, reset]);

    useEffect(() => {
        if (isOpen) fetchCountries();
    }, [fetchCountries, isOpen]);

    useEffect(() => {
        if (selectCountryId) {
            fetchCities(selectCountryId);
            // اختياري: تصغير الـ city_id إذا تغيرت الدولة
            // setValue("city_id", undefined); 
        }
    }, [selectCountryId, fetchCities]);

    const cityOptions = cities.map((city) => ({
        label: city.name[lang] || city.name,
        value: city.id,
    }));

    const countryOptions = countries.map((country) => ({
        label: country.name[lang] || country.name,
        value: country.id,
    }));

    const typeOptions = [
        { label: "Home / منزل", value: "home" },
        { label: "Work / عمل", value: "work" },
        { label: "Other / آخر", value: "other" },
    ];

    const onSubmit = async (data: CustomerInput) => {

        try {
            let result;
            if (customer) {
                result = await updateCustomer(customer.id, data);
            } else {
                result = await addCustomer(data);
            }

            if (result) {
                show("success", customer ? "تم تحديث البيانات" : "تمت الإضافة بنجاح");
                closeModal();
            }
        } catch (error) {

            handleServerErrors(error, setError, [
                "name", "phone", "email", "city_id", "country_id", "address", "street_details", "type"
            ]);
        } finally {
            setTimeout(() => hide(), 1200);
        }
    };

    const ActionButtons = () => (
        <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeModal}>إلغاء</Button>
            <Button
                variant={customer ? "update" : "primary"}
                onClick={() => formRef.current?.requestSubmit()}
                disabled={isLoading}
            >
                {isLoading ? "جاري الحفظ..." : customer ? "تحديث البيانات" : "حفظ العميل"}
            </Button>
        </div>
    );


    return (
        <BaseModal
            isOpen={isOpen}
            closeModal={closeModal}
            isLoading={isLoading}
            action={<ActionButtons />}
            title={customer ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
            description="يرجى ملء بيانات العميل بدقة لضمان سلامة عملية الشحن"
        >
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="text-right">
                <div className="grid gap-5 py-6">
                    
                    {/* الأساسيات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="اسم العميل" placeholder="الاسم الثلاثي..." error={errors.name?.message} {...register("name")} />
                        <Input label="رقم الهاتف" placeholder="01xxxxxxxxx" error={errors.phone?.message} {...register("phone")} />
                    </div>

                    {/* الموقع الجغرافي */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="country_id"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="الدولة"
                                    options={countryOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.country_id?.message}
                                    placeholder="اختر الدولة..."
                                />
                            )}
                        />
                        <Controller
                            name="city_id"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="المحافظة / المدينة"
                                    options={cityOptions}
                                    value={field.value}
                                    disabled={isLoadingCountry || isLoadingCity || !selectCountryId}
                                    onChange={field.onChange}
                                    error={errors.city_id?.message}
                                    placeholder={selectCountryId ? `اختر المحافظة...` : "اختر الدولة أولاً"}
                                />
                            )}
                        />
                    </div>

                    {/* تفاصيل إضافية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="نوع العنوان"
                                    options={typeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.type?.message}
                                />
                            )}
                        />
                         <Input label="البريد الإلكتروني (اختياري)" placeholder="customer@example.com" error={errors.email?.message} {...register("email")} />
                    </div>

                    <Input
                        label="تفاصيل الشارع / المنطقة"
                        placeholder="مثال: حي الأشجار، شارع 9"
                        error={errors.street_details?.message}
                        {...register("street_details")}
                    />

                    <Textarea
                        label="وصوف المنطقة"
                        placeholder="رقم العمارة، الطابق، علامة مميزة..."
                        error={errors.area?.message}
                        {...register("area")}
                    />
                </div>
            </form>
        </BaseModal>
    );
}