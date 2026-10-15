import { useState, useEffect, useCallback } from "react";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: string;
}

// Global state listeners للتنبيهات خارج الـ React Components إذا لزم الأمر
let listeners: ((toasts: ToastItem[]) => void)[] = [];
let memoryToasts: ToastItem[] = [];

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      variant: "success",
      duration: 3000,
      ...options,
    };

    memoryToasts = [...memoryToasts, newToast];
    listeners.forEach((listener) => listener(memoryToasts));

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        memoryToasts = memoryToasts.filter((t) => t.id !== id);
        listeners.forEach((listener) => listener(memoryToasts));
      }, newToast.duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(memoryToasts));
  }, []);

  return { toast, toasts, dismissToast };
}