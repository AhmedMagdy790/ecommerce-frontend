// src/features/payment/model/types/payment.dto.ts

import type { z } from "zod";
import { paymentGatewaySchema } from "../schema/paymentGatewaySchema";

export type CreatePaymentGatewayDto = z.infer<typeof paymentGatewaySchema>;

export type UpdatePaymentGatewayDto = Partial<CreatePaymentGatewayDto>;