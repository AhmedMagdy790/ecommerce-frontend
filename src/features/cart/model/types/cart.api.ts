import type { SuccessApiResponse } from "@/shared/types/api.types";
import type { CartItem } from "./cart.types";

export type CartListResponse = SuccessApiResponse<{ cart_items: CartItem[] }>;
export type CartSingleResponse = SuccessApiResponse<{ cart_item: CartItem }>;
export type CartDeleteResponse = SuccessApiResponse<null>;