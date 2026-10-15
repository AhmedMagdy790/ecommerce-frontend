// src/features/payment/dashboard/hooks/usePaymentGatewayForm.ts

import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  paymentGatewaySchema, 
  type PaymentGatewayFormData, 
  type PaymentGatewayFormInput 
} from "../model/schema/paymentGatewaySchema";
import { paymentGatewayDefaultValues } from "../constants/paymentGatewayFormDefault";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";
import type { PaymentGateway } from "../model/types/payment.types";
import { mapPaymentGatewayToForm } from "../dashboard/mappers/mapPaymentGatewayForm";
import { paymentGatewayAdapter } from "../adapters/paymentGateway.adapter";
import { usePaymentGatewayStore } from "../model/store/paymentGateway.store";
import type { TranslatedText } from "@/shared/types/types";

export const usePaymentGatewayForm = (
    initialData?: PaymentGateway<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = usePaymentGatewayStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<PaymentGatewayFormInput, unknown, PaymentGatewayFormData>({
        resolver: zodResolver(paymentGatewaySchema),
        defaultValues: paymentGatewayDefaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapPaymentGatewayToForm(initialData) : paymentGatewayDefaultValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : paymentGatewayDefaultValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(paymentGatewayDefaultValues);
    };

    const submitPaymentGateway = async (formData: PaymentGatewayFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                // استخدام الـ Adapter الذي يقوم بتغليف البيانات في FormData تلقائياً
                const payload = paymentGatewayAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = paymentGatewayAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit payment gateway:", error);

            // استخراج حقول أسماء ووصف اللغات ديناميكياً (مثال: name.ar, description.en)
            const nameFields = langKeys.map(
                (lang) => `name.${lang}` as Path<PaymentGatewayFormInput>
            );
            const descFields = langKeys.map(
                (lang) => `description.${lang}` as Path<PaymentGatewayFormInput>
            );

            // معالجة أخطاء الخادم وربطها بحقول النموذج
            handleServerErrors(error, setError, [
                ...nameFields,
                ...descFields,
                'slug',
                'type',
                'extra_fees',
                'is_active',
                'is_test_mode',
                'logo',
            ]);
        }
    };

    return {
        resetForm,
        submitPaymentGateway,
        methods,
        onSubmit: handleSubmit(submitPaymentGateway),
        isSubmitting,
        submitError,
        isEditMode,
    };
};