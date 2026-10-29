import { useEffect, useMemo, useRef, useState, type BaseSyntheticEvent } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleServerErrors } from "@/shared/utils/handleServerError";
import { profileService } from "@/features/profile/api/profile.service";
import type { User } from "@/features/users/model/types/user.types";

import {
    profileSchema,
    type ProfileFormData,
    type ProfileFormInput,
} from "../model/schema/profileSchema";
import { mapUserToProfileForm } from "../mappers/mapProfileForm";
import { profileAdapter } from "../adapters/profile.adapter";

export const useProfileForm = (
    currentUser?: User | null,
    onSuccess?: () => void,
) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const defaultValues = useMemo<ProfileFormInput>(
        () => ({
            name: "",
            email: "",
            phone: "",
        }),
        [],
    );

    const methods = useForm<ProfileFormInput, unknown, ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setError } = methods;

    const sanitizedInitialValues = useMemo(
        () => (currentUser ? mapUserToProfileForm(currentUser) : defaultValues),
        [currentUser, defaultValues],
    );

    useEffect(() => {
        if (currentUser) {
            reset(sanitizedInitialValues);
        }
    }, [currentUser, reset, sanitizedInitialValues]);

    const submitProfile = async (formData: ProfileFormData) => {
        if (submittingRef.current) return;

        submittingRef.current = true;
        setIsSubmitting(true);

        try {
            const cleanedData = {
                ...formData,
                phone: formData.phone || undefined,
            };

            const payload = profileAdapter.toUpdateDto(cleanedData);

            await profileService.updateProfile(payload);

            onSuccess?.();
        } catch (error: unknown) {
            handleServerErrors(error, setError, [
                "name" as Path<ProfileFormInput>,
                "email" as Path<ProfileFormInput>,
                "phone" as Path<ProfileFormInput>,
            ]);
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    return {
        methods,
        onSubmit: (event: BaseSyntheticEvent) =>
            handleSubmit(submitProfile)(event),
        isSubmitting,
    };
};