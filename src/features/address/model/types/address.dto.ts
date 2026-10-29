import type { addressSchema } from "../schema/addressSchema";
import type { z } from "zod";

export type CreateAddressDto = z.infer<typeof addressSchema> 

export type UpdateAddressDto = Partial<CreateAddressDto>;