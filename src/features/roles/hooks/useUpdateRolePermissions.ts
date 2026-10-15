import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EntityId } from "@/shared/types/entity";

import roleService from "../api/role.service";
import { roleKeys } from "./role.keys";

interface UpdateRolePermissionsVariables {
  roleId: EntityId;
  permissions: string[];
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissions,
    }: UpdateRolePermissionsVariables) =>
      roleService.updatePermissions(roleId, permissions),

    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: roleKeys.detail(variables.roleId),
      });
    },
  });
}