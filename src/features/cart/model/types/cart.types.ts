import type { ProductVariant } from "@/features/product-variants/model/types/productVariant.types";
import type { Product } from "@/features/product/model/types/product.types";

export interface ICartItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  total_price: number;
  item_total?: number; // لدعم كلاً من total_price أو item_total
  product: Product<string>;
  variant?: ProductVariant<string>; // لدعم استخدام item.variant في المكون
  created_at?: string;
  updated_at?: string;
}

export type CartItem = ICartItem;