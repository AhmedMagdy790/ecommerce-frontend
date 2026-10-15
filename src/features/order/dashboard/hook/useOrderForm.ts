// src/features/order/hooks/useOrderForm.ts

import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderFormData, type OrderFormInput } from "../../model/schema/orderSchema";
// import { useOrderStore } from "../store/useOrderStore";
// import type { InitialOrderData } from "../model/types/orderForm.types";
import { defaultOrderValues } from "../constants/orderFormDefault";
import { mapOrderToForm } from "../mappers/mapOrderForm";
// import { orderAdapter } from "../adapters/order.adapter";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { useOrderStore } from "../../model/store/order.store";
import orderAdapter from "../../adapters/order.adapter";
import type { Order } from "../../model/types/order.types";

export const useOrderForm = (
    initialData?: Order | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useOrderStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<OrderFormInput, unknown, OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: defaultOrderValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapOrderToForm(initialData) : defaultOrderValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : defaultOrderValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(defaultOrderValues);
    };

    const submitOrder = async (formData: OrderFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = orderAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = orderAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit order:", error);

            handleServerErrors(error, setError, [
                'user_id' as Path<OrderFormInput>,
                'customer_name' as Path<OrderFormInput>,
                'phone_primary' as Path<OrderFormInput>,
                'phone_secondary' as Path<OrderFormInput>,
                'customer_email' as Path<OrderFormInput>,
                'shipping_address' as Path<OrderFormInput>,
                'city_id' as Path<OrderFormInput>,
                'shipping_rate_id' as Path<OrderFormInput>,
                'payment_gateway_id' as Path<OrderFormInput>,
                'coupon_code' as Path<OrderFormInput>,
                'notes' as Path<OrderFormInput>,
                'items' as Path<OrderFormInput>,
            ]);
        }
    };

    return {
        resetForm,
        submitOrder,
        methods,
        onSubmit: handleSubmit(submitOrder),
        isSubmitting,
        submitError,
        isEditMode,
    };
};