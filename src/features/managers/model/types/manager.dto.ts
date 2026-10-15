import type { EntityId } from "@/shared/types/entity";

export interface UpdateUserRolesDto {
  roles: EntityId[];
}