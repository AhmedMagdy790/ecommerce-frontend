import axios from "axios";
import type {
  GlobalErrorContext,
  GlobalErrorSeverity,
} from "./error.types";

export interface ErrorPolicyResult {
  silent: boolean;
  severity: GlobalErrorSeverity;
  title: string;
  message: string;
  dedupeKey: string;
}

interface ErrorPolicyOptions {
  context: GlobalErrorContext;
  message?: string;
  title?: string;
  severity?: GlobalErrorSeverity;
  dedupeKey?: string;
  silent?: boolean;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "الطلب غير صالح. راجع البيانات وحاول مرة أخرى.",
  401: "انتهت صلاحية الجلسة. سجّل الدخول مرة أخرى.",
  403: "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
  404: "لم يتم العثور على العنصر المطلوب.",
  408: "انتهت مهلة الاتصال. حاول مرة أخرى.",
  422: "يرجى مراجعة البيانات المدخلة.",
  429: "طلبات كثيرة في وقت قصير. انتظر قليلًا وحاول مرة أخرى.",
  500: "حدث خطأ داخلي في الخادم.",
  502: "الخادم غير متاح مؤقتًا.",
  503: "الخدمة غير متاحة حاليًا. حاول لاحقًا.",
  504: "استغرق الخادم وقتًا أطول من المتوقع.",
};

function getStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  return error.response?.status;
}

function getDefaultMessage(
  error: unknown,
  status: number | undefined,
): string {
  if (axios.isCancel(error)) {
    return "";
  }

  if (axios.isAxiosError(error) && !error.response) {
    return "تعذر الاتصال بالسيرفر. تحقق من اتصال الإنترنت.";
  }

  if (status !== undefined) {
    return (
      STATUS_MESSAGES[status] ??
      "حدث خطأ أثناء تنفيذ الطلب. حاول مرة أخرى."
    );
  }

  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}

export function resolveErrorPolicy(
  error: unknown,
  options: ErrorPolicyOptions,
): ErrorPolicyResult {
  const status = getStatus(error);
  const isCanceled =
    axios.isCancel(error) ||
    (axios.isAxiosError(error) && error.code === "ERR_CANCELED");

  const isExpectedAuthFailure =
    status === 401 &&
    (options.context === "auth-init" ||
      options.context === "auth-refresh");

  const isFormValidationError = status === 422;

  const silent =
    options.silent === true ||
    isCanceled ||
    isExpectedAuthFailure ||
    isFormValidationError;

  const defaultSeverity: GlobalErrorSeverity =
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
      ? "dialog"
      : "toast";

  const message =
    options.message ?? getDefaultMessage(error, status);

  return {
    silent,
    severity: options.severity ?? defaultSeverity,
    title:
      options.title ??
      (defaultSeverity === "dialog"
        ? "حدث خطأ"
        : "تنبيه"),
    message,
    dedupeKey:
      options.dedupeKey ??
      `${options.context}:${status ?? "unknown"}:${message}`,
  };
}