// src/features/shipping/model/types/shipping.dto.ts
import type { z } from "zod";
import { shippingCourierSchema } from "../schema/shippingCourierSchema";

export type CreateShippingCourierDto = z.infer<typeof shippingCourierSchema>;

export type UpdateShippingCourierDto = Partial<CreateShippingCourierDto>;