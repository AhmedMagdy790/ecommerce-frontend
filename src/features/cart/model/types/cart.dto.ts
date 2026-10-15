import { z } from "zod";
import type { cartItemSchema } from "../schema/cartItemSchema";

// استخراج الـ DTOs تلقائياً من الـ Schema
export type AddToCartDto = z.infer<typeof cartItemSchema>;

// لو أردت تحديث الكمية لاحقاً
export type UpdateCartDto = Partial<AddToCartDto>;