export interface CartItem {
  id: string | number;
  productId: string | number; // Added to match CartItemData
  name: string;
  variant: string;
  image: string;
  price: number;
  quantity: number;
  currency: string; 
  salePrice: number;          // Added to match CartItemData
  slug?: string;
}