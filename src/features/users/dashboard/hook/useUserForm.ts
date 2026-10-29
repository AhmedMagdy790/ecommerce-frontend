// src/features/users/dashboard/hook/useUserForm.ts

import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormData, type UserFormInput } from "../../model/schema/userSchema";
import { useUserStore } from "../../model/store/useUserStore";
import type { User } from "../../model/types/user.types";
import { mapUserToForm } from "../mappers/mapUserForm";
import { userAdapter } from "../../adapters/user.adapter";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { defaultUserValues } from "../../constants/userFormDefault";

export const useUserForm = (
    initialData?: User | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useUserStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<UserFormInput, unknown, UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: defaultUserValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapUserToForm(initialData) : defaultUserValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : defaultUserValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(defaultUserValues);
    };

    const submitUser = async (formData: UserFormData) => {
        if (isSubmitting) return;

        try {


            if (isEditMode && initialData?.id) {
                const payload = userAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = userAdapter.toCreateDto(formData);
                await create(payload);
            }


            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit user:", error);

            handleServerErrors(error, setError, [
                'name' as Path<UserFormInput>,
                'email' as Path<UserFormInput>,
                'phone' as Path<UserFormInput>,
                'password' as Path<UserFormInput>,
                'password_confirmation' as Path<UserFormInput>,
            ]);
        }
    };

    return {
        resetForm,
        submitUser,
        methods,
        onSubmit: handleSubmit(submitUser),
        isSubmitting,
        submitError,
        isEditMode,
    };
};