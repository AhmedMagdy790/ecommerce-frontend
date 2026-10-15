// src/features/roles/hooks/useRoles.ts

import { useQuery } from "@tanstack/react-query";

import roleService from "../api/role.service";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: roleService.getAll,
  });
}