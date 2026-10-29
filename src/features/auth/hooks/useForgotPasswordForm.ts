// src/features/auth/hooks/useForgotPassword.ts

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../model/store/useAuthStore";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../model/schema/forgotPasswordSchema";

export const useForgotPasswordForm = () => {
  const { t } = useTranslation();

  const { forgotPassword, isLoading } = useAuthStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    },
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onFormSubmit = async (data: ForgotPasswordFormData) => {
    setSubmitError(null);

    try {
      await forgotPassword(data);
    } catch (err: unknown) {
      console.log(err);
      const responseMessage = (
        err as { response?: { data?: { message?: unknown } } } | null
      )?.response?.data?.message;
      const errorMessage =
        (typeof responseMessage === "string" && responseMessage) ||
        t('auth.unexpectedError');
      setSubmitError(errorMessage);
    }
  };

  return {
    methods,
    onSubmit: handleSubmit(onFormSubmit),
    isLoading: isLoading,
    isSuccess: isLoading,
    submitError
  };
};