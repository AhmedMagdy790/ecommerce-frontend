export type GlobalErrorSeverity = "toast" | "dialog";

export type GlobalErrorContext =
  | "general"
  | "auth-init"
  | "auth-refresh";

export interface GlobalErrorOptions {
  context?: GlobalErrorContext;
  severity?: GlobalErrorSeverity;
  message?: string;
  title?: string;
  dedupeKey?: string;
  silent?: boolean;
}

export interface GlobalErrorDialogState {
  title: string;
  message: string;
  dedupeKey: string;
}