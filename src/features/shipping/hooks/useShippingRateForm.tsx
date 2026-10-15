// src/features/shipping/hooks/useShippingRateForm.ts

import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  shippingRateSchema, 
  type ShippingRateFormData, 
  type ShippingRateFormInput 
} from "../model/schema/shippingRateSchema";
import { useShippingRateStore } from "../model/store/shippingRate.store";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import type { ShippingRate } from "../model/types/rate.types";
import shippingRateAdapter from "../adapters/shipping-rate.adapter";
import type { TranslatedText } from "@/shared/types/types.ts";
import { shippingRateDefaultValues } from "../dashboard/constants/shippingRateFormDefault";
import { mapShippingRateToForm } from "../dashboard/mappers/mapShippingRateForm";

export const useShippingRateForm = (
    initialData?: ShippingRate<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError,
        clearErrors
    } = useShippingRateStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<ShippingRateFormInput, unknown, ShippingRateFormData>({
        resolver: zodResolver(shippingRateSchema),
        defaultValues: shippingRateDefaultValues
    });

    const { reset, handleSubmit, setError, watch } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapShippingRateToForm(initialData) : shippingRateDefaultValues),
        [initialData]
    );

    const watchedCountryId = watch("country_id" as Path<ShippingRateFormInput>);

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            clearErrors();
            reset(isEditMode ? sanitizedInitialValues : shippingRateDefaultValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues, clearErrors]);

    const resetForm = () => {
        reset(shippingRateDefaultValues);
    };

    const submitRate = async (formData: ShippingRateFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = shippingRateAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = shippingRateAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit shipping rate:", error);

            // معالجة أخطاء الفاليديشن القادمة من لارافيل وربطها بحقول الفورم
            handleServerErrors(error, setError, [
                'country_id' as Path<ShippingRateFormInput>, // 🟢 تمت الإضافه هنا للأمان
                'city_id' as Path<ShippingRateFormInput>,
                'shipping_courier_id' as Path<ShippingRateFormInput>,
                'shipping_fee' as Path<ShippingRateFormInput>,
                'estimated_delivery_from' as Path<ShippingRateFormInput>,
                'estimated_delivery_to' as Path<ShippingRateFormInput>,
                'cod_fee' as Path<ShippingRateFormInput>,
                'base_cost' as Path<ShippingRateFormInput>,
                'base_weight' as Path<ShippingRateFormInput>,
                'extra_per_kg' as Path<ShippingRateFormInput>,
                'max_weight' as Path<ShippingRateFormInput>,
                'free_shipping_threshold' as Path<ShippingRateFormInput>,
                'is_active' as Path<ShippingRateFormInput>,
            ]);
        }
    };

    return {
        resetForm,
        submitRate,
        methods,
        onSubmit: handleSubmit(submitRate),
        isSubmitting,
        submitError,
        isEditMode,
        watchedCountryId, // 🟢 تصديرها للاستفادة منها عند الحاجة
    };
};