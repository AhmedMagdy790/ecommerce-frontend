import React, { useState, useEffect } from "react";
import { confirmInternal } from "./confirm";

export default function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "primary" as "primary" | "danger"
  });

  useEffect(() => {
    confirmInternal.setState(setState);
  }, []);

  const handleConfirm = () => {
    confirmInternal.resolve(true);
  };

  const handleCancel = () => {
    confirmInternal.resolve(false);
  };

  // Mapping the variants to your theme colors
  const confirmButtonStyles =
    state.variant === "danger"
      ? "bg-[var(--red-500,theme(colors.red.550))] hover:opacity-90"
      : "bg-[var(--color-primary)] hover:opacity-90";

  return (
    <>
      {children}

      {state.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[99999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card-bg,white)] dark:bg-[var(--color-surface-secondary,#1f2937)] p-6 rounded-[var(--radius-xl,24px)] w-full max-w-[400px] shadow-2xl border border-[var(--color-border,#e5e7eb)] animate-in zoom-in-95 duration-200">

            <h2 className="text-lg font-bold text-[var(--color-text-primary,gray)]">
              {state.title}
            </h2>

            <p className="text-sm text-[var(--color-text-secondary,gray)] mt-3 leading-relaxed">
              {state.description}
            </p>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-[var(--color-surface-secondary,#f3f4f6)] dark:bg-gray-800 text-[var(--color-text-primary,gray)] rounded-[var(--radius-lg,12px)] text-sm font-bold hover:opacity-80 transition-colors cursor-pointer"
              >
                {state.cancelText}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className={`px-6 py-2.5 text-white rounded-[var(--radius-lg,12px)] text-sm font-bold shadow-lg transition-all active:scale-95 cursor-pointer ${confirmButtonStyles}`}
              >
                {state.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}