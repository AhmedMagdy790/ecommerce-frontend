import type { PaginatedApiResponse, SuccessApiResponse } from "@/shared/types/api.types";
import type { ProductVariant } from "./productVariant.types";
import type { variantFormData } from "../schema/variantSchema";

export type ProductVariantListResponse = PaginatedApiResponse<ProductVariant>;

export type ProductVariantSingleResponse = SuccessApiResponse<{ productVariant: ProductVariant }>;

export type ProductVariantDeleteResponse = SuccessApiResponse<null>;

export type CreateProductVariantDto = variantFormData;

export type UpdateProductVariantDto = Partial<variantFormData>;