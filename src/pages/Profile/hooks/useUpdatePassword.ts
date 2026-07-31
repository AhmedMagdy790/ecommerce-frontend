import { useState } from "react";
import { authApi } from "@/api/client";
import { handleApiError } from "@/api/error";
import toast from "react-hot-toast";
import type { PasswordFormValues } from "../schemas/password.schema";

export function useUpdatePassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePassword = async (data: PasswordFormValues, onSuccessCallback?: () => void) => {
    try {
      setIsSubmitting(true);
      const response: any = await authApi.updatePassword(data);
      
      toast.success(response?.message || "Password updated successfully");
      

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updatePassword,
    isSubmitting,
  };
}