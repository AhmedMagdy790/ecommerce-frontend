import { type StateCreator } from "zustand";
import { castDraft } from "immer";

import { createAsyncAction } from "@/shared/store/asyncAction";

export type EntityId = string | number;

export interface ToggleState {
  isToggling: boolean;
  toggleError: string | null;
  togglingId: EntityId | null;
  toggleStatus(id: EntityId): Promise<void>;
}

export interface ToggleStateBase<TItem> {
  items: TItem[];
}

export interface ToggleStoreOptions<
  TItem,
  TResponse,
  TStatus,
> {
  service: {
    toggleStatus(
      id: EntityId,
    ): Promise<TResponse>;
  };

  extractItem(
    response: TResponse,
  ): TItem;

  getStatus(
    item: TItem,
  ): TStatus;

  getNextStatus(
    currentStatus: TStatus,
    item: TItem,
  ): TStatus;

  setStatus(
    item: TItem,
    status: TStatus,
  ): TItem;

  onChanged?: (
    item: TItem,
    previousStatus: TStatus,
    response: TResponse,
  ) => void;

  errorMessage?: string;
}

export function createToggleStore<
  TItem extends { id: EntityId },
  TResponse,
  TStatus,
  TState extends ToggleStateBase<TItem> & ToggleState,
>(
  options: ToggleStoreOptions<
    TItem,
    TResponse,
    TStatus
  >,
): StateCreator<
  TState,
  [["zustand/immer", never]],
  [],
  ToggleState
> {
  return (set, get) => {
    const executeToggle = createAsyncAction(
      set,
      "isToggling",
      "toggleError",
    );

    return {
      isToggling: false,
      toggleError: null,
      togglingId: null,

      toggleStatus: async (id) => {
        // 1. العنصر الحالي
        const currentItem = get().items.find(
          (item) => item.id === id,
        );

        if (!currentItem) return;

        // 2. الحالة الحالية
        const previousStatus =
          options.getStatus(currentItem);

        // 3. الحالة الجديدة
        const nextStatus =
          options.getNextStatus(
            previousStatus,
            currentItem,
          );

        // 4. Snapshot للـ rollback
        const snapshot = get().items.map(
          (item) => ({ ...item }) as TItem,
        );

        // 5. بداية العملية
        set((state) => {
          state.togglingId = id;
          state.toggleError = null;
        });

        // 6. Optimistic update
        set((state) => {
          const index =
            state.items.findIndex(
              (item) => item.id === id,
            );

          if (index === -1) return;

          const currentItem =
            state.items[index];

          const updatedItem =
            options.setStatus(
              { ...currentItem } as TItem,
              nextStatus,
            );

          state.items[index] =
            castDraft(updatedItem);
        });

        // 7. API
        await executeToggle(
          async () => {
            try {
              const response =
                await options.service.toggleStatus(
                  id,
                );

              // 8. استخراج العنصر من response
              const updatedItem =
                options.extractItem(response);

              if (!updatedItem) {
                throw new Error(
                  "Toggle response did not contain a valid item",
                );
              }

              let changedItem:
                | TItem
                | undefined;

              set((state) => {
                const index =
                  state.items.findIndex(
                    (item) =>
                      item.id ===
                      updatedItem.id,
                  );

                if (index === -1) return;

                Object.assign(
                  state.items[index],
                  updatedItem,
                );

                changedItem = {
                  ...state.items[index],
                } as TItem;
              });

              // 9. Callback
              if (changedItem) {
                options.onChanged?.(
                  changedItem,
                  previousStatus,
                  response,
                );
              }
            } catch (error) {
              // 10. Rollback
              set((state) => {
                state.items =
                  castDraft(snapshot);
              });

              throw error;
            } finally {
              // 11. انتهاء العملية
              set((state) => {
                state.togglingId = null;
              });
            }
          },
          options.errorMessage ??
            "فشل تغيير الحالة",
        );
      },
    };
  };
}