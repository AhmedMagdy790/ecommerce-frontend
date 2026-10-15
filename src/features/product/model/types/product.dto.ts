// src/features/product/types/product.dto.ts

import type { z } from "zod";
import type { productSchema } from "../schema/productSchema";


export type  CreateProductDto = z.infer<typeof productSchema>;

export type UpdateProductDto = Partial<CreateProductDto>

