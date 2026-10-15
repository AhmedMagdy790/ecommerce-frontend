import { useEffect, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { profileSchema, type ProfileFormData, type ProfileFormInput } from "../model/schema/profileSchema";
import { useProfileStore } from "../model/store/useProfileStore";
import type { User } from "@/features/auth/model/types/user.types";
import { mapUserToProfileForm } from "../mappers/mapProfileForm";
import { profileAdapter } from "../adapters/profile.adapter";

export const useProfileForm = (
    currentUser?: User | null,
    onSuccess?: () => void
) => {
    const { 
        updateProfile,
        isSubmitting, 
        submitError
    } = useProfileStore();

    const defaultValues: ProfileFormInput = useMemo(() => ({
        name: "",
        email: "",
        phone: "",
    }), []);

    const methods = useForm<ProfileFormInput, unknown, ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: defaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const sanitizedInitialValues = useMemo(
        () => (currentUser ? mapUserToProfileForm(currentUser) : defaultValues),
        [currentUser, defaultValues]
    );

    useEffect(() => {
        if (currentUser) {
            reset(sanitizedInitialValues);
        }
    }, [currentUser, reset, sanitizedInitialValues]);

    const submitProfile = async (formData: ProfileFormData) => {
        if (isSubmitting) return;

        try {
            const cleanedData = {
                ...formData,
                phone: formData.phone || undefined,
            };

            const payload = profileAdapter.toUpdateDto(cleanedData);
            await updateProfile(payload);

            onSuccess?.();
        } catch (error: unknown) {
            console.error("Failed to update profile:", error);

            handleServerErrors(error, setError, [
                'name' as Path<ProfileFormInput>,
                'email' as Path<ProfileFormInput>,
                'phone' as Path<ProfileFormInput>,
            ]);
        }
    };

    return {
        methods,
        onSubmit: handleSubmit(submitProfile),
        isSubmitting,
        submitError,
    };
};