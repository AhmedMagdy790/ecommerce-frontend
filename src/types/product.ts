export interface Product {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  description?: string;
  category?: string;
  tags?: string[];
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
}

// Utility type for when you only need a subset for grids/listings
export type ProductSummary = Pick<Product, 'id' | 'slug' | 'name' | 'image' | 'price' | 'oldPrice'>;