// src/features/countries/hooks/useCountryForm.ts

import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { countrySchema, type CountryFormData, type CountryFormInput } from "../model/schema/countrySchema";
import { useCountryStore } from "../model/store/useCountryStore";
import { countryDefaultValues } from "../constants/countryFormDefault";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";
import type { Country } from "../model/types/country.types";
import { mapCountryToForm } from "../dashboard/mappers/mapCountryForm";
import { countryAdapter } from "../adapters/country.adapter";
import type { TranslatedText } from "@/shared/types/types";

export const useCountryForm = (
    initialData?: Country<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useCountryStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<CountryFormInput, unknown, CountryFormData>({
        resolver: zodResolver(countrySchema),
        defaultValues: countryDefaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapCountryToForm(initialData) : countryDefaultValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : countryDefaultValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(countryDefaultValues);
    };

    const submitCountry = async (formData: CountryFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = countryAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = countryAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit country:", error);

            // استخراج حقول أسماء اللغات ديناميكياً (مثال: name.ar, name.en)
            const nameFields = langKeys.map(
                (lang) => `name.${lang}` as Path<CountryFormInput>
            );

            // معالجة أخطاء الفاليديشن القادمة من لارافيل وربطها بحقول الفورم
            handleServerErrors(error, setError, [
                ...nameFields,
                'code',
                'phone_code',
                "currency",
                'is_active'
            ]);
        }
    };

    return {
        resetForm,
        submitCountry,
        methods,
        onSubmit: handleSubmit(submitCountry),
        isSubmitting,
        submitError,
        isEditMode,
    };
};