// src/features/cart/services/cartService.ts

import { storeApi } from "@/api/client";
import type { ICartItem } from "../model/types/cart.types";

export const cartService = {
    /**
     * Get all cart items for the authenticated user.
     */
    getCartItems: async (): Promise<ICartItem[]> => {
        const response = await storeApi.getCart();

        return response.data.cart_items ?? [];
    },

    /**
     * Add or update an item variant in the cart.
     */
    addToCart: async (payload: { product_variant_id: number | string; quantity: number }): Promise<ICartItem> => {
        const response = await storeApi.addToCart(payload);

        return response.data.cart_item;
    },

    /**
     * Remove a specific cart item by its ID.
     */
    removeFromCart: async (id: string | number): Promise<void> => {
        await storeApi.removeFromCart(id);
    },

    /**
     * Clear the entire shopping cart.
     */
    clearCart: async (): Promise<void> => {
        await storeApi.clearCart();
    },
};

export default cartService;