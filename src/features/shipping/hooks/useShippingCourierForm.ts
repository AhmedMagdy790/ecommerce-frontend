// src/features/shipping/hooks/useShippingCourierForm.ts

import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  shippingCourierSchema, 
  type ShippingCourierFormData, 
  type ShippingCourierFormInput 
} from "../model/schema/shippingCourierSchema";
import { useShippingCourierStore } from "../model/store/shippingCourier.store";
import { shippingCourierDefaultValues } from "../dashboard/constants/shippingCourierFormDefault.ts";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";
import type { ShippingCourier } from "../model/types/shipping.types";
import { mapShippingCourierToForm } from "../dashboard/mappers/mapShippingCourierForm.ts";
import shippingCourierAdapter from "../adapters/shipping-courier.adapter";
import type { TranslatedText } from "@/shared/types/types.ts";

export const useShippingCourierForm = (
    initialData?: ShippingCourier<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError,
        clearErrors
    } = useShippingCourierStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<ShippingCourierFormInput, unknown, ShippingCourierFormData>({
        resolver: zodResolver(shippingCourierSchema),
        defaultValues: shippingCourierDefaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapShippingCourierToForm(initialData) : shippingCourierDefaultValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            clearErrors();
            reset(isEditMode ? sanitizedInitialValues : shippingCourierDefaultValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(shippingCourierDefaultValues);
    };

    const submitCourier = async (formData: ShippingCourierFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = shippingCourierAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = shippingCourierAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit shipping courier:", error);

            // استخراج حقول أسماء اللغات ديناميكياً (مثال: name.ar, name.en)
            const nameFields = langKeys.map(
                (lang) => `name.${lang}` as Path<ShippingCourierFormInput>
            );

            // استخراج حقول الوصف ديناميكياً أيضاً إذا كان مترجماً
            const descriptionFields = langKeys.map(
                (lang) => `description.${lang}` as Path<ShippingCourierFormInput>
            );

            // معالجة أخطاء الفاليديشن القادمة من لارافيل وربطها بحقول الفورم
            handleServerErrors(error, setError, [
                ...nameFields,
                ...descriptionFields,
                'code',
                'phone',
                'email',
                'api_endpoint',
                'api_key',
                'supports_cod',
                'tracking_url',
                'is_active',
                'driver',
                'logo'
            ]);
        }
    };

    return {
        resetForm,
        submitCourier,
        methods,
        onSubmit: handleSubmit(submitCourier),
        isSubmitting,
        submitError,
        isEditMode,
    };
};