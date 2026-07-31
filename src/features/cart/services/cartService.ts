// src/features/cart/services/cartService.ts

import { storeApi } from "@/api/client";
import type { ICartItem } from "@/features/cart/types";

/**
 * Cart service refactored to use storeApi cleanly while preserving unwrap logic,
 * optional parameters, and required type definitions.
 */
const cartService = {
    /**
     * Get all cart items for the authenticated user.
     */
    getCartItems: async (params?: Record<string, any>): Promise<ICartItem[]> => {
        // Pass params if storeApi supports them, or call directly
        const response = await storeApi.getCart<any>(params);
        console.log(response)
        return response.data?.data ?? response.data ?? response;
    },

    /**
     * Add or update an item variant in the cart.
     */
    addToCart: async (data: { product_variant_id: number | string; quantity?: number }): Promise<any> => {
        const response = await storeApi.addToCart<any, typeof data>(data);
        return response.data?.data ?? response.data ?? response;
    },

    /**
     * Remove a specific cart item by its ID.
     */
    removeFromCart: async (id: string | number): Promise<any> => {
        const response = await storeApi.removeFromCart<any>(id);
        return response.data?.data ?? response.data ?? response;
    },
};

export default cartService;