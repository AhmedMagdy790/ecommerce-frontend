import { create } from "zustand";
import type { GlobalErrorDialogState } from "@/shared/errors/error.types";

interface GlobalErrorState {
  dialog: GlobalErrorDialogState | null;
  showDialog: (dialog: GlobalErrorDialogState) => void;
  closeDialog: () => void;
}

export const useGlobalErrorStore = create<GlobalErrorState>((set) => ({
  dialog: null,

  showDialog: (dialog) => {
    set({ dialog });
  },

  closeDialog: () => {
    set({ dialog: null });
  },
}));