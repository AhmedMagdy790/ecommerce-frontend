import { useState } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { handleServerErrors } from "@/shared/utils/handleServerError";
import { profileService } from "@/features/profile/api/profile.service";

import {
  passwordSchema,
  type PasswordFormData,
  type PasswordFormInput,
} from "../model/schema/profileSchema";

import { profileAdapter } from "../adapters/profile.adapter";

export const usePasswordForm = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: PasswordFormInput = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  const methods = useForm<
    PasswordFormInput,
    unknown,
    PasswordFormData
  >({
    resolver: zodResolver(passwordSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setError } = methods;

  const submitPassword = async (formData: PasswordFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = profileAdapter.toPasswordDto(formData);

      await profileService.updatePassword(payload);

      // Clear sensitive fields after successful update.
      reset(defaultValues);
      onSuccess?.();
    } catch (error: unknown) {
      handleServerErrors(error, setError, [
        "current_password" as Path<PasswordFormInput>,
        "password" as Path<PasswordFormInput>,
        "password_confirmation" as Path<PasswordFormInput>,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    methods,
    onSubmit: handleSubmit(submitPassword),
    isSubmitting,
  };
};