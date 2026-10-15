// src/features/order/model/types/order.dto.ts

import type { z } from "zod"; 
import type { orderSchema } from "../schema/orderSchema";


export type CreateOrderDto = z.infer<typeof orderSchema>
// نوع التحديث يكون اختياري لكل الحقول
export type UpdateOrderDto = Partial<CreateOrderDto>;

