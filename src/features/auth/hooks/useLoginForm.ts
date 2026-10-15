// src/features/auth/hooks/useLoginForm.ts

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../model/store/useAuthStore";
import { loginSchema, type LoginFormData } from "../model/schema/loginSchema";

export const useLoginForm = () => {
  const { t } = useTranslation();

  const { login, isLoading } = useAuthStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onFormSubmit = async (data: LoginFormData) => {
    setSubmitError(null);

    try {
      await login(data);
    } catch (err: any) {
      console.log(err);
      const errorMessage =
        err?.response?.data?.message ||
        t(
          'auth.unexpectedError'
        );
      setSubmitError(errorMessage);
    }
  };

  return {
    methods,
    onSubmit: handleSubmit(onFormSubmit),
    isLoading,
    submitError
  };
};