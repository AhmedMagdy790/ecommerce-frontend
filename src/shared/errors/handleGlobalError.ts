import { toast } from "react-hot-toast";
import { resolveErrorPolicy } from "./error-policy";
import type { GlobalErrorOptions } from "./error.types";
import { useGlobalErrorStore } from "../store/useGlobalErrorStore";

const DEDUPE_WINDOW_MS = 3000;

const recentErrors = new Map<string, number>();

function isDuplicate(key: string): boolean {
  const now = Date.now();

  for (const [existingKey, timestamp] of recentErrors) {
    if (now - timestamp >= DEDUPE_WINDOW_MS) {
      recentErrors.delete(existingKey);
    }
  }

  const previousTimestamp = recentErrors.get(key);

  if (
    previousTimestamp !== undefined &&
    now - previousTimestamp < DEDUPE_WINDOW_MS
  ) {
    return true;
  }

  recentErrors.set(key, now);
  return false;
}

export function handleGlobalError(
  error: unknown,
  options: GlobalErrorOptions = {},
): void {
  const context = options.context ?? "general";

  const policy = resolveErrorPolicy(error, {
    context,
    message: options.message,
    title: options.title,
    severity: options.severity,
    dedupeKey: options.dedupeKey,
    silent: options.silent,
  });

  if (policy.silent || !policy.message) {
    return;
  }

  if (isDuplicate(policy.dedupeKey)) {
    return;
  }

  if (policy.severity === "dialog") {
    useGlobalErrorStore.getState().showDialog({
      title: policy.title,
      message: policy.message,
      dedupeKey: policy.dedupeKey,
    });

    return;
  }

  toast.error(policy.message, {
    id: policy.dedupeKey,
    duration: 4000,
  });
}