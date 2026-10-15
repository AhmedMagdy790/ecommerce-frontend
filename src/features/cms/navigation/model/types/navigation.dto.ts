import type { z } from "zod";
import type { navMenuSchema } from "../schema/navMenuSchema";
import type { navMenuItemSchema } from "../schema/navMenuItemSchema";

// NavMenu DTOs
export type CreateNavMenuDto = z.infer<typeof navMenuSchema>;
export type UpdateNavMenuDto = Partial<CreateNavMenuDto>;

// NavMenuItem DTOs
export type CreateNavMenuItemDto = z.infer<typeof navMenuItemSchema>;
export type UpdateNavMenuItemDto = Partial<CreateNavMenuItemDto>;