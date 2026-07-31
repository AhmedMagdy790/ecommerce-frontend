// src/features/dashboard/cart/types/cart.ts

export type CartItem = {
  id: number;
  product_variant_id: number;
  quantity: number;
  item_total: number;
  product: {
    id: number;
    name: string;
    slug: string;
  };
  variant: {
    id: number;
    sku: string;
    color: string;
    size: string;
    price: number;
  };
};