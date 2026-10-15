import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { navMenuSchema, type NavMenuFormData, type NavMenuFormInput } from "../../model/schema/navMenuSchema";
import type { InitialNavMenuData } from "../../model/types/navigation.types";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { useNavigationStore } from "../../model/store/navigationStore";
import navigationAdapter from "../../adapters/navigation.adapter";

const defaultValues: NavMenuFormInput = {
    name: "",
    location: "",
    is_active: true,
};

export const useNavigationForm = (
    initialData?: InitialNavMenuData | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useNavigationStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<NavMenuFormInput, unknown, NavMenuFormData>({
        resolver: zodResolver(navMenuSchema),
        defaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? {
            name: initialData.name,
            location: initialData.location,
            is_active: initialData.is_active,
        } : defaultValues),
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

    const submitNavigation = async (formData: NavMenuFormData) => {
        console.log("submit")
        if (isSubmitting) return;


        try {
            if (isEditMode && initialData?.id) {
                const payload = navigationAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = navigationAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit navigation menu:", error);

            handleServerErrors(error, setError, [
                'name',
                'location',
                'is_active'
            ]);
        }
    };

    return {
        resetForm,
        submitNavigation,
        methods,
        onSubmit: handleSubmit(submitNavigation),
        isSubmitting,
        submitError,
        isEditMode,
    };
};