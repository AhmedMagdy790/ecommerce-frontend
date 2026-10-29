import type { EntityId } from "@/shared/types/entity";
import type { managerSchema } from "../schema/managerSchema";
import { type z } from "zod";

export interface UpdateUserRolesDto {
  roles: EntityId[];
}

export type CreateMangerDto = z.infer<typeof managerSchema>;

export type UpdateMangerDto = Partial<CreateMangerDto>;