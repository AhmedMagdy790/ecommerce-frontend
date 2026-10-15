import type { FieldErrors } from "react-hook-form";
import type { PaginationMeta } from "../types/api.types";

export const unwrapResponse = <T>(response: any): {
  data: T;
  status: string;
  message: string;
} => {

  const payload = response.data?.data
    ? response.data
    : response;

  return {
    data: payload.data as T,
    status: payload.status,
    message: payload.message,
  };
};

export const getTranslatedError = <T extends Record<string, any>>(
  error: FieldErrors<T>[keyof T],
  lang: string
): string | undefined => {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const typedError = error as Record<string, any>;
  const fieldError = typedError[lang];

  return fieldError?.message;
};


export function getFirstFormError(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") {
    return null;
  }

  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (!value || typeof value !== "object") {
      continue;
    }

    const error = value as Record<string, unknown>;

    if (typeof error.message === "string") {
      return error.message;
    }

    const nestedMessage = getFirstFormError(error);

    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return null;
}

export function extractStatsSafely<TStats extends Record<string, number>>(
  rawStats: unknown,
  shape: TStats
): TStats {
  const isValidStatsObject =
    rawStats != null &&
    typeof rawStats === "object" &&
    !Array.isArray(rawStats);

  if (!isValidStatsObject) {
    return shape;
  }

  const result = { ...shape };

  for (const key of Object.keys(shape) as (keyof TStats)[]) {
    const value = (rawStats as Record<string, unknown>)[key as string];
    result[key] = (Number(value) || 0) as TStats[keyof TStats];
  }

  return result;
}

export const checkLanguageError = (errors: any, lang: string, fields: string[] = ["name", "description"]) => {
  return fields.some((field) => Boolean(errors[field]?.[lang]));
};

export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function getImageUrl(url?: string | null, fallback: string = "/default-avatar.png"): string {
  if (!url) {
    return fallback;
  }
  return url;
}

export const incrementTotal = (pagination: PaginationMeta) => ({
    ...pagination,
    total: pagination.total + 1,
});

export const decrementTotal = (pagination: PaginationMeta) => ({
    ...pagination,
    total: Math.max(0, pagination.total - 1),
});

export function removeItemById<T extends { id: number | string }>(
    items: T[],
    id: number | string
) {
    return items.filter(item => item.id !== id);
}

export function prependItem<T>(
    items: T[],
    item: T
) {
    return [item, ...items];
}

export function replaceItem<T extends { id: number | string }>(
    items: T[],
    updated: T
) {
    return items.map(item =>
        item.id === updated.id ? updated : item
    );
}