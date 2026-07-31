import { create } from "zustand"
import {
  getCart,
  addToCartApi,
  updateCartApi,
  deleteCartApi
} from "../services/cartService"
import { type CartItem } from "../types/cart"

type CartState = {
  items: CartItem[]

  fetchCart: () => Promise<void>
  addToCart: (item: CartItem) => Promise<void>
  updateQuantity: (id: number, qty: number) => Promise<void>
  removeFromCart: (id: number) => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  fetchCart: async () => {
    const data = await getCart()
    set({ items: data })
  },

  addToCart: async (item) => {
    await addToCartApi(item)

    const updated = await getCart()
    set({ items: updated })
  },


  updateQuantity: async (id, qty) => {
    await updateCartApi(id, qty)

    const updated = await getCart()
    set({ items: updated })
  },

  removeFromCart: async (id) => {
    await deleteCartApi(id)

    const updated = await getCart()
    set({ items: updated })
  }
}))

