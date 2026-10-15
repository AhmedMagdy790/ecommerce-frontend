import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { passwordSchema, type PasswordFormData, type PasswordFormInput } from "../model/schema/profileSchema";
import { useProfileStore } from "../model/store/useProfileStore";
import { profileAdapter } from "../adapters/profile.adapter";

export const usePasswordForm = (onSuccess?: () => void) => {
    const { 
        updatePassword,
        isSubmitting, 
        submitError
    } = useProfileStore();

    const defaultValues: PasswordFormInput = {
        current_password: "",
        password: "",
        password_confirmation: "",
    };

    const methods = useForm<PasswordFormInput, unknown, PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: defaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const submitPassword = async (formData: PasswordFormData) => {
        if (isSubmitting) return;

        try {
            const payload = profileAdapter.toPasswordDto(formData);
            await updatePassword(payload);

            // تفريغ الحقول بعد النجاح لأسباب أمنية
            reset(defaultValues);
            onSuccess?.();
        } catch (error: unknown) {
            console.error("Failed to update password:", error);

            handleServerErrors(error, setError, [
                'current_password' as Path<PasswordFormInput>,
                'password' as Path<PasswordFormInput>,
                'password_confirmation' as Path<PasswordFormInput>,
            ]);
        }
    };

    return {
        methods,
        onSubmit: handleSubmit(submitPassword),
        isSubmitting,
        submitError,
    };
};