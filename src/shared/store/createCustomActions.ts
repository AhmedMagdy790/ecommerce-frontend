import type { StateCreator } from "zustand";

/* =========================================================
 * Zustand Types
 * =======================================================*/

export type FeatureSet<TState> = Parameters<
  StateCreator<
    TState,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    TState
  >
>[0];

export type FeatureGet<TState> = Parameters<
  StateCreator<
    TState,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    TState
  >
>[1];

/* =========================================================
 * Context
 * =======================================================*/

export interface CustomActionContext<TState> {
  set: FeatureSet<TState>;
  get: FeatureGet<TState>;
}

/* =========================================================
 * Creator
 * =======================================================*/

export type CustomActionsCreator<
  TState,
  TCustomState extends object = Record<string, never>,
> = (context: CustomActionContext<TState>) => TCustomState;

/* =========================================================
 * Factory
 * =======================================================*/

export function createCustomActions<
  TState,
  TCustomState extends object = Record<string, never>,
>(
  creator: CustomActionsCreator<TState, TCustomState>,
): CustomActionsCreator<TState, TCustomState> {
  return creator;
}