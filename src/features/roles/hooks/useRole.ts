import { useQuery } from "@tanstack/react-query";

import type { EntityId } from "@/shared/types/entity";

import roleService from "../api/role.service";
import { roleKeys } from "./role.keys";

export function useRole(id: EntityId | undefined) {
  return useQuery({
    queryKey: id === undefined
      ? roleKeys.details()
      : roleKeys.detail(id),

    queryFn: () => {
      if (id === undefined) {
        throw new Error("Role ID is required");
      }

      return roleService.getRoleById(id);
    },

    enabled: id !== undefined,
  });
}