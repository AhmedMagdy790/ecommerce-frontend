// src/features/order/store/order.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import orderServices from "../../api/orderService";
import { orderAdapter } from "../../adapters/order.adapter";
import { createOrderActions, type OrderCustomState } from "./order.actions"; // 🟢 استيراد الإجراءات والنوع
import type { Order, OrderFilters, OrderStatus } from "../types/order.types";
import type { CreateOrderDto, UpdateOrderDto } from "../types/order.dto";
import type { OrderDeleteResponse, OrderListResponse, OrderSingleResponse } from "../types/order.api";
import { orderStatusHooks } from "./OrderStatusHooks";
import type { TranslatedText } from "@/shared/types/types";

export const useOrderStore = createFeatureStore<
  Order<TranslatedText>,                                  // 1. TModel
  CreateOrderDto,                         // 2. TCreateDto
  UpdateOrderDto,                         // 3. TUpdateDto
  OrderFilters,                           // 4. TFilters
  OrderListResponse,                      // 5. TListRes
  OrderSingleResponse,                    // 6. TSingleRes
  OrderDeleteResponse,                    // 7. TDeleteRes
  OrderSingleResponse,                    // 8. TUpdateRes
  OrderListResponse,                      // 9. TTrashRes
  OrderSingleResponse,                    // 10. TRestoreRes
  OrderDeleteResponse,                    // 11. TForceDeleteRes
  OrderCustomState,                     
  OrderStatus                             // 13. TStatus
>({
  name: "OrderStore",

  service: orderServices,

  adapter: orderAdapter,

  defaultFilters: {
    page: 1,
    per_page: 15,
    search: "",
  },

  defaultSortBy: "created_at",

  customActions: createOrderActions,

  hooks: {
    onFetched: (response) => {
      const stats = orderAdapter.extractStats(response);
      orderStatusHooks.onFetched(stats);
    },
    onCreated: orderStatusHooks.onCreated,
    onDeleted: orderStatusHooks.onDeleted,
  },

  toggle: {
    extractItem: orderAdapter.fromToggleResponse,
    getStatus: (item) => item.status,
    getNextStatus: (currentStatus) => currentStatus,
    setStatus: (item, status) => ({
      ...item,
      status: status,
    }),
    errorMessage: "فشل تغيير حالة الطلب",
  },
});