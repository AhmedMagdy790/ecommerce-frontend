import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormData, type AddressFormInput } from "../model/schema/addressSchema";
import { useAddressStore } from "../model/store/useAddressStore";
import { addressAdapter } from "../adapters/address.adapter";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import type { Address } from "../model/types/address.types";
import { defaultAddressValues } from "../constants/addressFormDefault";



export const useAddressForm = (
    initialData?: Address | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useAddressStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<AddressFormInput, unknown, AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: defaultAddressValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    // تحويل بيانات العنوان القديمة لتتطابق مع شكل الـ Form إن وجد، أو استخدام القيم الافتراضية
    const sanitizedInitialValues = useMemo(() => {
        if (!initialData) return defaultAddressValues;
        
        return {
            country_id: initialData.country_id,
            city_id: initialData.city_id,
            type: initialData.type || "shipping",
            street_details: initialData.street_details || "",
            area: initialData.area || "",
            building_number: initialData.building_number || "",
            phone_contact: initialData.phone_contact || "",
            is_default: Boolean(initialData.is_default),
        };
    }, [initialData]);

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : defaultAddressValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(defaultAddressValues);
    };

    const submitAddress = async (formData: AddressFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                // استخدام الـ adapter إذا كان موجوداً، أو إرسال الـ formData مباشرة
                const payload = addressAdapter.toUpdateDto ? addressAdapter.toUpdateDto(formData) : formData;
                await update(initialData.id, payload);
            } else {
                const payload = addressAdapter.toCreateDto ? addressAdapter.toCreateDto(formData) : formData;
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit address:", error);

            // التقاط أخطاء الـ Backend ومعالجتها لكل حقول العنوان
            handleServerErrors(error, setError, [
                'country_id',
                'city_id',
                'type',
                'street_details',
                'area',
                'building_number',
                'phone_contact',
                'is_default'
            ] as Path<AddressFormInput>[]);
        }
    };

    return {
        resetForm,
        submitAddress,
        methods,
        onSubmit: handleSubmit(submitAddress),
        isSubmitting,
        submitError,
        isEditMode,
    };
};