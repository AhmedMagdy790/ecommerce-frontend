import type {
    FieldValues,
    Path,
    UseFormSetError,
} from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";


type ErrorStateSetter = (
  partial: { error: string | null }
) => void;

export const handleStoreError = (
  error: unknown,
  defaultMessage: string,
  set: ErrorStateSetter
): never => {
  const message = getErrorMessage(error, defaultMessage);

  set({ error: message });

  throw error;
};


export const handleServerErrors = <T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>,
  fields?: Path<T>[]
) => {
  if (!axios.isAxiosError(error) || !error.response) {
    toast.error("تعذر الاتصال بالسيرفر");
    return;
  }

  const { status, data } = error.response;

  if (status !== 422 || !data?.errors) {
    return;
  }

  Object.entries(data.errors).forEach(([field, messages]) => {
    const errorMessage =
      Array.isArray(messages) && messages.length > 0
        ? String(messages[0])
        : "قيمة غير صحيحة";

    if (!setError) return;

    if (fields?.includes(field as Path<T>)) {
      setError(field as Path<T>, {
        type: "server",
        message: errorMessage,
      });
    } else {
      setError("root" as Path<T>, {
        type: "server",
        message: errorMessage,
      });
    }
  });
};


export function getErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}