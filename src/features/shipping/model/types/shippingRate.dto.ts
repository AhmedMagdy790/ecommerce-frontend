// src/features/shipping/model/types/shippingRate.dto.ts
import type { z } from "zod";
import { shippingRateSchema } from "../schema/shippingRateSchema";

export type CreateShippingRateDto = z.infer<typeof shippingRateSchema>;

export type UpdateShippingRateDto = Partial<CreateShippingRateDto>;