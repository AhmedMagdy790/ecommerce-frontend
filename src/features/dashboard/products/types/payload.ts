// src/features/dashboard/products/types/payload.ts

export interface CreateVariantPayload {
  sku: string;

  price: number;

  stock: number;

  attributes: {
    size?: string;
    color?: string;
  };

  length?: number;
  width?: number;
  height?: number;
  weight?: number;

  status?: "active" | "draft";
}


export interface CreateProductPayload {
  name: {
    ar: string;
    en: string;
  };

  description: {
    ar: string;
    en: string;
  };

  brand_id: number;
  category_id: number;

  featured_image?: File;

  gallery?: File[];

  variants: CreateVariantPayload[];
}

export type UpdateProductPayload =
  Partial<CreateProductPayload>;