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

  // 0. معالجة أخطاء الشبكة وانقطاع السيرفر (Network Error / ERR_CONNECTION_REFUSED)
  if (!error.response || error.code === "ERR_NETWORK" || error.message === "Network Error") {
    // استخدام ID ثابت يمنع التكرار نهائياً ويظهر توست واحد فقط
    toast.error("عذراً، تعذر الاتصال بالسيرفر. يرجى التحقق من اتصالك.", { id: "global-network-error" });
    return;
  }

  const status = error.response.status;
  const data = error.response.data as BackendError;

  // 1. أخطاء التحقق (Validation Errors - 422)
  if (status === 422 && data?.errors) {
    // دمج الأخطاء في رسالة واحدة أو استخدام ID لكل حقل، أو الاكتفاء بعرض أول خطأ لتجنب زحمة الشاشة
    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) {
      toast.error(firstError, { id: "validation-error" });
    }
    return;
  }

  // 2. أخطاء الصلاحيات (403)
  if (status === 403) {
    toast.error("ليس لديك صلاحية للقيام بهذا الإجراء", { id: "forbidden-error" });
    return;
  }

  // 3. أخطاء عامة من السيرفر (مع استخدام ID لتجنب التكرار إذا تكررت نفس الاستجابة)
  const errorMessage = data?.message || "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً";
  toast.error(errorMessage, { id: "general-server-error" });
};