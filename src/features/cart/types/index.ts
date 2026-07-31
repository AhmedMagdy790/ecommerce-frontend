export interface ICartProduct {
  id: number;
  name: {
    ar: string;
    en: string;
  };
  slug: string;
}

export interface ICartVariant {
  id: number;
  price: number;
  sku: string;
  color?: string | null;
  size?: string | null;
}

export interface ICartItem {
  id: number;
  item_total: number;
  quantity: number;
  product: ICartProduct;
  variant: ICartVariant;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}