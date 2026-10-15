// src/features/order/adapters/order.adapter.ts
import type { PaginationMeta } from "@/shared/types/api.types";
import type { Order, OrderStatsData } from "../model/types/order.types";
import type { OrderListResponse, OrderSingleResponse } from "../model/types/order.api";
import { extractStatsSafely } from "@/shared/utils/helper";
import type { CreateOrderDto, UpdateOrderDto } from "../model/types/order.dto";
import type { OrderFormData } from "../model/schema/orderSchema";
import type { TranslatedText } from "@/shared/types/types";

export const orderAdapter = {
  fromListResponse(response: OrderListResponse): Order<TranslatedText>[] {
    return response.data.items ?? [];
  },

  fromSingleResponse(response: OrderSingleResponse): Order<TranslatedText> {
    return response.data.order;
  },

  fromCreateResponse(response:  OrderSingleResponse): Order<TranslatedText> {
    return response.data.order;
  },

  fromUpdateResponse(response: OrderSingleResponse): Order<TranslatedText> {
    return response.data.order;
  },

  fromToggleResponse(response: OrderSingleResponse): Order<TranslatedText> {
    return response.data.order;
  },

  extractPagination(response: OrderListResponse): PaginationMeta {
    return response.data.pagination ?? {
      type: "server",
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    };
  },

  extractStats(
    response: OrderListResponse
  ): OrderStatsData {
    return extractStatsSafely(
      response.data.stats,
      {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
        returned: 0,
        trashed: 0,
      }
    );
  },

  toCreateDto(formData: OrderFormData): CreateOrderDto {
        return {
            user_id: formData.user_id ?? null,
            customer_name: formData.customer_name ?? "",
            phone_primary: formData.phone_primary ?? "",
            phone_secondary: formData.phone_secondary ?? null,
            customer_email: formData.customer_email ?? null,
            shipping_address: formData.shipping_address ?? "",
            shipping_address2: formData.shipping_address2 ?? null,
            city_id: Number(formData.city_id),
            shipping_rate_id: Number(formData.shipping_rate_id),
            payment_gateway_id: Number(formData.payment_gateway_id),
            coupon_code: formData.coupon_code ?? null,
            notes: formData.notes ?? null,
            idempotency_key: formData.idempotency_key,
            items: formData.items.map((item) => ({
                product_variant_id: Number(item.product_variant_id),
                quantity: Number(item.quantity),
            })),
        };
    },

    toUpdateDto(formData: OrderFormData): UpdateOrderDto {
        // غالباً في التحديث يتم إرسال نفس هيكل الإنشاء أو حقول محددة حسب متطلبات الباك إند
        return this.toCreateDto(formData);
    },
};

export default orderAdapter;