import { type UseFormSetError, type FieldValues, type Path } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

export const handleServerErrors = <T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>,
  fields?: string[]
) => {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;

    if (status === 422 && data.errors) {
      Object.entries(data.errors).forEach(([field, messages]) => {
        const errorMessage = (messages as string[])[0];

        if (setError) {
          // التحقق مما إذا كان الحقل ضمن الحقول المسموح بها في الفورم
          if (fields && fields.includes(field)) {
            setError(field as Path<T>, {
              type: "server",
              message: errorMessage,
            });
          } else {
            // إذا لم يكن الحقل موجوداً أو لم يتم تمرير حقول محددة، نستخدم root
            setError("root" as Path<T>, {
              type: "server",
              message: errorMessage,
            });
          }
        }
      });
      // إرجاع رسالة عامة إذا لزم الأمر
      return data;
    }
  } else {
    toast.error("تعذر الاتصال بالسيرفر");
  }
};