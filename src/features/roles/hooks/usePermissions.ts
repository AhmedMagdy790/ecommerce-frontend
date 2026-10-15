// src/features/roles/hooks/usePermissions.ts

import { useQuery } from "@tanstack/react-query";

import roleService from "../api/role.service";

export function usePermissions() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: roleService.getAllPermissions,
  });
}