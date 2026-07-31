import React, { useEffect, useState, useRef, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/shared/components/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { type OrderInput } from "../../../schema/orderSchema";
import { useCityStore } from "@/features/dashboard/city/store/useCityStore";
import { useCountryStore } from "@/features/dashboard/country/store/useCountryStore";
import { useLang } from "@/shared/context/LanguageContext";
import { useCustomerStore } from "@/features/dashboard/customer/store/useCustomerStore";
import { map } from "zod";
import FilterDataTable from "@/shared/components/DataTable/FiltterDataTable";

interface IStepProps {
    onNext: () => void;
}

export default function ShippingStep({ onNext }: IStepProps) {
    const {
        register,
        formState: { errors },
        control,
        watch,
        setValue
    } = useFormContext<OrderInput>();

    const { cities, fetchCities, loading: isLoadingCities } = useCityStore();
    const { countries, fetchCountries, loading: isLoadingCountry } = useCountryStore();
    const { customers, fetchCustomers, isLoading: isLoadingCustomers } = useCustomerStore();
    const [ search, setSearch] = useState("");
    const { lang } = useLang();


    const items = watch("items");

    const totalWeight = useMemo(() => {
        return items?.reduce((acc, item) => acc + (Number(item.weight) * Number(item.quantity)), 0) || 0;
    }, [items]);

    // يمكنك تخزينه في حقل مخفي أو إرساله مع الطلب
    useEffect(() => {
        setValue("total_weight", totalWeight);
    }, [totalWeight, setValue]);


    useEffect(() => { fetchCountries(); }, []);
    useEffect(() => { 
        fetchCustomers({search: search, limit: 10}); 
    }, [search]);

    const selectedCountryId = watch("country_id");

    const prevCountryId = useRef(selectedCountryId);

    useEffect(() => {
      
        if(selectedCountryId)  fetchCities(selectedCountryId);
        if (selectedCountryId && selectedCountryId !== prevCountryId.current) {


            setValue("city_id", null as any, { 
                shouldValidate: false,
                shouldDirty: true 
            });           
        }


        if(!selectedCountryId) {
            setValue("city_id", null as any, { 
                shouldValidate: false,
                shouldDirty: true 
            });
        }

        prevCountryId.current = selectedCountryId;
    }, [selectedCountryId, fetchCities, setValue]);


    const countryOptions = useMemo(() => 
        countries?.map((c) => ({ label: c.name[lang], value: c.id })), 
    [countries, lang]);

    const cityOptions = useMemo(() => 
        cities?.map((c) => ({ label: c.name[lang], value: c.id })), 
    [cities, lang]);


    const handleCustomerSelect = (customer: any) => {
        setValue("customer_id", customer.id);
        setValue("customer_name", customer.name);
        setValue("phone_primary", customer.phone);
      
        const defaultAddress = customer?.addresses?.find(add => add.is_default) 
                           || customer?.addresses?.[0];

        if (defaultAddress) {
            setValue("country_id", defaultAddress?.country.id);
            setValue("city_id", defaultAddress?.city.id);
            setValue("shipping_address", defaultAddress?.street_details);
        }
        setSearch("");
    };

    return (
       <div className="space-y-5 ...">
        <h3 className="text-lg font-bold border-b pb-2">بيانات الشحن والتواصل</h3>

            <div className="relative">
                <Input
                    label="ابحث عن عميل سابق (بالاسم أو الهاتف)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابدأ بكتابة اسم العميل للملء التلقائي..."
                />
     
                {search.length > 0 && customers.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                        {customers.slice(0, 3).map((customer) => (
                            <li 
                                key={customer.id}
                                onClick={() => handleCustomerSelect(customer)}
                                className="p-3 hover:bg-primary/10 cursor-pointer border-b last:border-0 dark:border-gray-800 transition-colors"
                            >
                                <div className="font-bold text-sm">{customer.name}</div>
                                <div className="text-xs text-gray-500">Phone: {customer.phone} Email: {customer.email}</div>
                            </li>
                        ))}
                    </ul>
                )}

                {search.length > 2 && customers.length === 0 && !isLoadingCustomers && (
                    <div className="absolute z-50 w-full bg-gray-50 dark:bg-gray-900 p-3 text-xs text-center border-main-border rounded-md mt-1">
                        لا يوجد عميل بهذا الاسم، أكمل البيانات يدوياً
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Input
                        label="اسم العميل المستلم"
                        {...register("customer_name")}
                        error={errors.customer_name?.message}
                    /> 
                </div>

                <Controller 
                    name="country_id"
                    control={control}
                    render={({field}) => (
                        <CustomSelect
                            label="الدولة"
                            value={field.value}
                            disabled={isLoadingCountry}
                            onChange={field.onChange}
                            placeholder="اختر الدولة..."
                            options={countryOptions}
                            error={errors.country_id?.message}
                        />
                    )}
                />      

                <Controller 
                    name="city_id"
                    control={control}
                    render={({field}) => (
                        <CustomSelect
                            label="المدينة / المحافظة"
                            value={field.value}
                            disabled={!selectedCountryId || isLoadingCities}
                            onChange={field.onChange}
                            placeholder={!selectedCountryId ? "اختر الدولة أولاً" : "اختر المدينة"}
                            options={cityOptions}
                            error={errors.city_id?.message}
                        />
                    )}
                />      
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* phone renamed to phone_primary to match backend */}
                <Input
                    label="رقم الهاتف الأساسي"
                    placeholder="01xxxxxxxxx"
                    error={errors.phone_primary?.message}
                    {...register("phone_primary")}
                />

                <Input
                    label="رقم هاتف إضافي (اختياري)"
                    placeholder="01xxxxxxxxx"
                    error={errors.phone_secondary?.message}
                    {...register("phone_secondary")}
                />
            </div>
       
            <Input
                label="العنوان بالكامل"
                placeholder="اسم الشارع، رقم المبنى، الشقة..."
                error={errors.shipping_address?.message}
                {...register("shipping_address")}
            />

            <Textarea
                label="ملاحظات للطلب (اختياري)"
                placeholder="أي تعليمات خاصة لشركة الشحن..."
                error={errors.notes?.message}
                {...register("notes")}
            />
        </div>
    );
}