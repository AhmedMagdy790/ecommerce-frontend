// src/features/order/api/order.service.ts
import { adminApi } from "@/api/client";

import type { 
  SuccessApiResponse 
} from "@/shared/types/api.types";

import type { Order, OrderFilters, OrderStatus } from "../model/types/order.types";
import type { CreateOrderDto, UpdateOrderDto } from "../model/types/order.dto";
import type { OrderListResponse, OrderSingleResponse } from "../model/types/order.api";
import type { TranslatedText } from "@/shared/types/types";


export const orderServices = {
  /**
   * جلب قائمة الطلبات مع الدعم للفلترة والتصفح (Pagination)
   */
  getAll(params?: OrderFilters) {
    return adminApi.getOrders<OrderListResponse>(params);
  },
  
  create(payload: CreateOrderDto) {
    return adminApi.createCity<SuccessApiResponse<{ order: Order<TranslatedText> }>, CreateOrderDto>(
      payload
    );
  },

  /**
   * جلب قائمة الطلبات المحذوفة (Soft Deleted)
   */
  getTrashed(params?: OrderFilters) {
    return adminApi.getTrashedOrders<OrderListResponse>(params);
  },

  /**
   * جلب تفاصيل طلب محدد بواسطة الـ ID
   */
  getOrderById(id: number | string) {
    return adminApi.getOrderById<OrderSingleResponse>(id);
  },

  /**
   * تحديث بيانات الطلب الأساسية
   */
  update(id: number | string, payload: UpdateOrderDto) {
    return adminApi.updateOrder<
      SuccessApiResponse<{ order: Order<TranslatedText> }>,
      UpdateOrderDto
    >(id, payload);
  },

  /**
   * تحديث حالة الطلب (Order Status / Payment Status)
   */
  updateStatus(id: number | string, payload: OrderStatus) {

    return adminApi.updateOrderStatus<OrderSingleResponse, { status: OrderStatus}>(id, { status: payload});
  },

  /**
   * حذف الطلب مؤقتاً (Soft Delete)
   */
  delete(id: number | string) {
    return adminApi.deleteOrder<SuccessApiResponse<null>>(id);
  },

  /**
   * استعادة طلب محذوف
   */
  restore(id: number | string) {

    console.log("Herre");
    return adminApi.restoreOrder<SuccessApiResponse<{ order: Order<TranslatedText> }>>(id);
  },

  /**
   * حذف الطلب بشكل نهائي من قاعدة البيانات
   */
  forceDelete(id: number | string) {
    return adminApi.forceDeleteOrder<SuccessApiResponse<null>>(id);
  }
};

export default orderServices;