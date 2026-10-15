// src/shared/store/asyncAction.ts

import { getErrorMessage } from "../utils/handleServerError";

export const createAsyncAction = <
  TState extends object,
  TLoading extends keyof TState,
  TError extends keyof TState
>(
  set: (
    recipe: (state: TState) => void
  ) => void,
  loadingKey: TLoading,
  errorKey: TError
) => {
  const updateState = (
    state: TState,
    key: keyof TState,
    value: unknown
  ) => {
    (state as Record<string, unknown>)[String(key)] = value;
  };

  return async <T>(
    action: () => Promise<T>,
    fallbackMessage: string
  ): Promise<T> => {
    set((state) => {
      updateState(state, loadingKey, true);
      updateState(state, errorKey, null);
    });

    try {
      return await action();
    } catch (error) {
      const message = getErrorMessage(error, fallbackMessage);

      set((state) => {
        updateState(state, errorKey, message);
      });

      throw error;
    } finally {
      set((state) => {
        updateState(state, loadingKey, false);
      });
    }
  };
};