// statusStore.ts
import { create } from "zustand";

type StatusType = "loading" | "success" | "error" | null;
type bgStyle = "full" | "blur" | "none" | "simple";

interface StatusState {
  type: StatusType;
  message: string;
  isVisible: boolean;
  bgStyle: bgStyle;
  btnClose: boolean;
  
  show: (type: StatusType, message?: string, bgStyle?: bgStyle) => void;
  hide: () => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  type: null,
  message: "",
  isVisible: false,
  bgStyle: 'blur',
  btnClose: false,


  show: (type, message = "", bgStyle = 'blur', btnClose = false) =>

    set({
      type,
      message,
      isVisible: true,
      btnClose: btnClose,
      bgStyle: bgStyle
    }),

  hide: () =>
    set({
      type: null,
      message: "",
      isVisible: false,
      btnClose: false,
      bgStyle: 'blur'
    }),
}));
