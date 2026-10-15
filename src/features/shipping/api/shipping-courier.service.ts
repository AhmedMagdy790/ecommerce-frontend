// src/features/shipping/api/shipping-courier.service.ts
import { adminApi } from "@/api/client";


import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";
import type { ShippingCourier, ShippingFilters } from "../model/types/shipping.types";
import type { CreateShippingCourierDto, UpdateShippingCourierDto } from "../model/types/shipping.dto";
import type { TranslatedText } from "@/shared/types/types";
import type { ShippingCourierListResponse } from "../model/types/shipping.api";

export const shippingCourierServices = {

  getAll(params?: ShippingFilters) {
    return adminApi.getCouriers<ShippingCourierListResponse>(params);
  },

  getTrashed(params?: ShippingFilters) {
    return adminApi.getTrashedCouriers<ShippingCourierListResponse>(params);
  },

  create(payload: CreateShippingCourierDto) {
    return adminApi.createCourier<SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>, CreateShippingCourierDto>(payload);
  },

  update(id: number | string, payload: UpdateShippingCourierDto) {
    return adminApi.updateCourier<SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>, UpdateShippingCourierDto>(id, payload);
  },

  toggleStatus(id: number | string) {

    return adminApi.toggleCourier<SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>>(id);
  },

  delete(id: number | string) {
    return adminApi.deleteCourier<SuccessApiResponse<null>>(id);
  },

  restore(id: number | string) {
    return adminApi.restoreCourier<SuccessApiResponse<{ courier: ShippingCourier<TranslatedText> }>>(id);
  },

  forceDelete(id: number | string) {
    return adminApi.forceDeleteCourier<SuccessApiResponse<null>>(id);
  }
};

export default shippingCourierServices;