import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface BackendError {
  message: string;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    console.error("Unknown Error:", error);
    return;
  }

  if (!error.response || error.code === "ERR_NETWORK" || error.message === "Network Error") {

    toast.error("عذراً، تعذر الاتصال بالسيرفر. يرجى التحقق من اتصالك.", { id: "global-network-error" });
    return;
  }

  const status = error.response.status;
  const data = error.response.data as BackendError;

  if (status === 422 && data?.errors) {

    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) {
      toast.error(firstError, { id: "validation-error" });
    }
    return;
  }

  if (status === 403) {
    toast.error("ليس لديك صلاحية للقيام بهذا الإجراء", { id: "forbidden-error" });
    return;
  }

  const errorMessage = data?.message || "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً";
  console.log("errorMessage", errorMessage)
  // toast.error(errorMessage, { id: "general-server-error" });
};

export const getErrorMessage = (
    error: unknown,
    fallback: string
) => error instanceof Error ? error.message : fallback;