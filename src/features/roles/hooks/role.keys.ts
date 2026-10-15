// src/features/roles/hooks/role.keys.ts

import type { EntityId } from "@/shared/types/entity";

export const roleKeys = {
  all: ["roles"] as const,

  lists: () => [...roleKeys.all, "list"] as const,

  details: () => [...roleKeys.all, "detail"] as const,

  detail: (id: EntityId) =>
    [...roleKeys.details(), id] as const,
};