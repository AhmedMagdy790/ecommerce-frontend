// src/features/cities/hook/useCityForm.ts
import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { citySchema, type CityFormData, type CityFormInput } from "../../model/schema/citySchema";
import type { City } from "../../model/types/city.types";
import { defaultValues } from "../constants/cityFormDefault";
import { mapCityToForm } from "../mappers/mapCityForm";
import { cityAdapter } from "../../adapters/city.adapter";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";
import { useCityStore } from "../../model/store/city.store";
import type { TranslatedText } from "@/shared/types/types";

export const useCityForm = (
    initialData?: City<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useCityStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<CityFormInput, unknown, CityFormData>({
        resolver: zodResolver(citySchema),
        defaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapCityToForm(initialData) : defaultValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : defaultValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(defaultValues);
    };

    const submitCity = async (formData: CityFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = cityAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = cityAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit city:", error);

            const nameFields = langKeys.map(
                (lang) => `name.${lang}` as Path<CityFormInput>
            );

            handleServerErrors(error, setError, [
                ...nameFields,
                'country_id',
                'is_active'
            ]);
        }
    };

    return {
        resetForm,
        submitCity,
        methods,
        onSubmit: handleSubmit(submitCity),
        isSubmitting,
        submitError,
        isEditMode,
    };
};