import type { Product } from "../product/model/types/product.types";

export interface IWishlistItem {
  id: number | string;
  user_id?: number | string;
  product: Product<string>;
  created_at?: string;
  updated_at?: string;
}

export interface AddToWishlistPayload {
  product_id: number | string;
}