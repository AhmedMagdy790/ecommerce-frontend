// src/features/product/types/product.ts

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  isAvailable: boolean;

  attributes: {
    size?: string;
    color?: string;
  };
}

export interface ProductBrand {
  id: number;
  name: string;
  logo?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductReview {
  id: number;
  name: string;
  comment: string;
  rating: number;
}

export interface ProductSummary {
  id: number;
  slug: string;

  name: string;

  image: string;

  price: number;

  oldPrice?: number;
}

export interface Product {
  id: number;
  slug: string;

  name: string;
  description: string;

  image: string;

  gallery: {
    images: string[];
  };

  price: number;
  oldPrice?: number;

  stock: number;

  rating: number;
  reviewsCount: number;

  variants: {
    list: ProductVariant[];
    sizes: string[];
    colors: string[];
  };

  brand?: ProductBrand;
  category?: ProductCategory;

  reviews: ProductReview[];

  relatedProducts: ProductSummary[];
}