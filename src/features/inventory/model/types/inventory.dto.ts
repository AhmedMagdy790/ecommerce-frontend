import type { inventorySchema } from "../schema/inventorySchema";
import type { z } from "zod";

export type CreateInventoryDto = z.infer<typeof inventorySchema>

export type UpdateInventoryDto = Partial<CreateInventoryDto>;