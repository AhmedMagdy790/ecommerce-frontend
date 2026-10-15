// src/features/shipping/model/store/shippingCourier.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import shippingCourierServices from "../../api/shipping-courier.service";
import shippingCourierAdapter from "../../adapters/shipping-courier.adapter";
import type { TranslatedText } from "@/shared/types/types";
import type {
  ShippingCourier,
  ShippingFilters,
} from "../types/shipping.types";
import type {
  CreateShippingCourierDto,
  UpdateShippingCourierDto,
} from "../types/shipping.dto";
import type {
  ShippingCourierDeleteResponse,
  ShippingCourierListResponse,
  ShippingCourierSingleResponse,
} from "../types/shipping.api";
import { ShippingStatsHooks } from "./shippingStatusHooks";

export const useShippingCourierStore = createFeatureStore<
  ShippingCourier<TranslatedText>,        // 1. TModel
  CreateShippingCourierDto,               // 2. TCreateDto
  UpdateShippingCourierDto,               // 3. TUpdateDto
  ShippingFilters,                        // 4. TFilters
  ShippingCourierListResponse,            // 5. TListRes
  ShippingCourierSingleResponse,          // 6. TSingleRes
  ShippingCourierDeleteResponse,          // 7. TDeleteRes
  ShippingCourierSingleResponse,          // 8. TUpdateRes
  ShippingCourierListResponse,            // 9. TTrashRes
  ShippingCourierSingleResponse,          // 10. TRestoreRes
  ShippingCourierDeleteResponse,          // 11. TForceDeleteRes
  Record<string, never>,                  // 12. TExtraState
  boolean                                 // 13. TToggleStatus (is_active boolean)
>({
  name: "ShippingCourierStore",

  service: shippingCourierServices,

  adapter: shippingCourierAdapter,

  defaultFilters: {},

  defaultSortBy: "id",

  hooks: {
    onFetched: (response) => {
      ShippingStatsHooks.onFetched(response.data?.stats);
    },
    onCreated: ShippingStatsHooks.onCreated,
    onDeleted: ShippingStatsHooks.onDeleted,
  },

  toggle: {
    extractItem: shippingCourierAdapter.fromToggleResponse,

    getStatus: (item) => item.is_active,

    getNextStatus: (currentStatus) => !currentStatus,

    setStatus: (item, status) => ({
      ...item,
      is_active: status,
    }),

    onChanged: ShippingStatsHooks.onToggled,

    errorMessage: "فشل تغيير حالة شركة الشحن",
  },
});