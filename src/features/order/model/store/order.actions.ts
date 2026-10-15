// src/features/order/store/order.actions.ts

import { createCustomActions } from "@/shared/store/createCustomActions";
import type { Order, OrderFilters, OrderStatus } from "../types/order.types";
import { orderStatusHooks } from "./OrderStatusHooks";
import orderServices from "../../api/orderService";
import type { EntityId } from "@/shared/store/createToggleStore";
import type { CombinedFeatureState } from "@/shared/store/createFeatureStore";
import type { CreateOrderDto, UpdateOrderDto } from "../types/order.dto";
import type { TranslatedText } from "@/shared/types/types";

export interface OrderStatusState {
  isUpdatingStatus: boolean;
  statusUpdateError: string | null;
  updatingStatusId: EntityId | null;
}

export interface OrderStatusActions {
  updateOrderStatus(
    id: EntityId,
    status: OrderStatus,
  ): Promise<void>;

}

export type OrderCustomState =
  OrderStatusState &
  OrderStatusActions;

type OrderStoreState =
  CombinedFeatureState<
    Order<TranslatedText>,
    CreateOrderDto,
    UpdateOrderDto,
    OrderFilters
  > &
  OrderCustomState;

export const createOrderActions =
  createCustomActions<OrderStoreState, OrderCustomState>(
  ({ set, get }) => ({
    isUpdatingStatus: false,
    statusUpdateError: null,
    updatingStatusId: null,

    async updateOrderStatus(id, status) {

      const state = get();
      const previousItems = state.items.map(item => ({ ...item }));
      const previousSelected = state.selectedItem ? { ...state.selectedItem } : null;

      const targetIndex = state.items.findIndex(
        item => String(item.id) === String(id),
      );

      if (targetIndex === -1) {
        set((state) => {
          state.statusUpdateError = "Order not found";
        });
        return;
      }

      const targetOrder = state.items[targetIndex];
      const previousStatus = targetOrder.status;

      if (previousStatus === status) return;

      set((state) => {
        state.isUpdatingStatus = true;
        state.updatingStatusId = id;
        state.statusUpdateError = null;

        state.items[targetIndex].status = status;

        if (state.selectedItem && String(state.selectedItem.id) === String(id)) {
          state.selectedItem.status = status;
        }
      });

      orderStatusHooks.onStatusChanged({ ...targetOrder, status }, previousStatus);

      try {
        const response = await orderServices.updateStatus(id, status);
        const updatedOrder = response?.data?.order;

        set((state) => {
          state.isUpdatingStatus = false;
          state.updatingStatusId = null;

          if (updatedOrder) {
            const index = state.items.findIndex(
              item => String(item.id) === String(updatedOrder.id),
            );

            if (index !== -1) {
              state.items[index] = {
                ...state.items[index],
                ...updatedOrder,
              };
            }
          }
        });
      } catch (error) {
        set((state) => {
          state.items = previousItems;
          state.selectedItem = previousSelected;
          state.isUpdatingStatus = false;
          state.updatingStatusId = null;
          state.statusUpdateError =
            error instanceof Error ? error.message : "Failed to update order status";
        });

        orderStatusHooks.onStatusChanged(targetOrder, status);
      }
    },

  })
);