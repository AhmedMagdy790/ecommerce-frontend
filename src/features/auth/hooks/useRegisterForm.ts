// src/features/auth/hooks/useRegisterForm.ts

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../model/store/useAuthStore";
import type { RegisterDto } from "../model/types/auth.dto";
import { registerSchema } from "../model/schema/registerSchema";
import { getErrorMessage } from "@/shared/utils/handleServerError";


export const useRegisterForm = () => {
  const { t } = useTranslation();

  const { createAcount, isLoading } = useAuthStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmed: "",
    },
    mode: "onTouched",
  });

  const { handleSubmit } = methods;

  const onFormSubmit = async (data: RegisterDto) => {
    setSubmitError(null);

    try {
      await createAcount(data);
    } catch (error: unknown) {
      const message = getErrorMessage(error, t("An unexpected error occurred"));
      setSubmitError(message);
    }
  };

  return {
    methods,
    onSubmit: handleSubmit(onFormSubmit),
    isLoading,
    submitError
  };
};