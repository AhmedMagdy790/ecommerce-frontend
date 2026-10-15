export type VariantStatus = "active" | "inactive";

export interface CreateProductVariantDto {
  id?: number | string;
  sku: string;
  price: number;
  stock: number;
  status: VariantStatus;
  attributes: Record<string, string>;
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
}

export type UpdateProductVariantDto =
  Partial<CreateProductVariantDto> & {
    id?: number | string;
  };