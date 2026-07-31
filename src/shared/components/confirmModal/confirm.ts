type ConfirmVariant = "primary" | "danger";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
};

type ConfirmState = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmVariant;
};

let resolveFn: ((value: boolean) => void) | null = null;

let setState: ((state: ConfirmState) => void) | null = null;

const defaultOptions: ConfirmState = {
  isOpen: false,
  title: "",
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "primary"
};

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    resolveFn = resolve;

    if (setState) {
      setState({
        ...defaultOptions,
        ...options,
        isOpen: true,
      });
    }
  });
};

export const confirmInternal = {
  setState: (fn: (state: ConfirmState) => void) => (setState = fn),
  resolve: (value: boolean) => {
    resolveFn?.(value);
    resolveFn = null;
    setState?.({ ...defaultOptions, isOpen: false });
  },
};