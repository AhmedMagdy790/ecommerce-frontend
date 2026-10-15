// src/features/shipping/model/store/shippingRate.store.ts

import { createFeatureStore } from "@/shared/store/createFeatureStore";
import shippingRateService from "../../api/shipping-rate.service";
import shippingRateAdapter from "../../adapters/shipping-rate.adapter"; // تأكد من إنشاء الأداة لاحقاً أو توفرها
import type { TranslatedText } from "@/shared/types/types";
import type {
  ShippingRate,
  ShippingRateFilters,
} from "../types/rate.types";
import type {
  CreateShippingRateDto,
  UpdateShippingRateDto,
} from "../types/shippingRate.dto";
import type {
  ShippingRateDeleteResponse,
  ShippingRateListResponse,
  ShippingRateSingleResponse,
} from "../types/shippingRate.api";
import { ShippingRateStatsHooks } from "./shippingRateStats.store";


export const useShippingRateStore = createFeatureStore<
  ShippingRate<TranslatedText>,           // 1. TModel
  CreateShippingRateDto,               // 2. TCreateDto
  UpdateShippingRateDto,               // 3. TUpdateDto
  ShippingRateFilters,                 // 4. TFilters
  ShippingRateListResponse,            // 5. TListRes
  ShippingRateSingleResponse,          // 6. TSingleRes
  ShippingRateDeleteResponse,          // 7. TDeleteRes
  ShippingRateSingleResponse,          // 8. TUpdateRes
  ShippingRateListResponse,            // 9. TTrashRes (إن وجد soft delete للأسعار)
  ShippingRateSingleResponse,          // 10. TRestoreRes
  ShippingRateDeleteResponse,          // 11. TForceDeleteRes
  Record<string, never>,                  // 12. TExtraState
  boolean                                 // 13. TToggleStatus (is_active boolean)
>({
  name: "ShippingRateStore",

  service: shippingRateService,

  adapter: shippingRateAdapter,

  defaultFilters: {},

  defaultSortBy: "id",

  hooks: {
    onFetched: (response) => {
      ShippingRateStatsHooks.onFetched(response.data?.stats);
    },
    onCreated: ShippingRateStatsHooks.onCreated,
    onDeleted: ShippingRateStatsHooks.onDeleted,
  },

  toggle: {
    extractItem: shippingRateAdapter.fromToggleResponse,

    // قراءة الحالة من الكائن المتداخل
    getStatus: (item) => item.settings.is_active,

    getNextStatus: (currentStatus) => !currentStatus,

    // تحديث الحالة داخل كائن settings مع الحفاظ على بقية الخصائص المتداخلة
    setStatus: (item, status) => ({
      ...item,
      settings: {
        ...item.settings,
        is_active: status,
      },
    }),

    errorMessage: "فشل تغيير حالة سعر الشحن",
  },
});