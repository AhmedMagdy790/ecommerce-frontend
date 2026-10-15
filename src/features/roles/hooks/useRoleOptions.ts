// src/features/roles/hooks/useRoleOptions.ts

import { useEffect, useMemo } from "react";
import { useRoleStore } from "../model/store/role.store";


export function useRoleOptions() {
  const roles = useRoleStore((state) => state.roles);
  const fetchRoles = useRoleStore((state) => state.fetchRoles);
  const isLoading = useRoleStore((state) => state.isLoading);

  useEffect(() => {
    if (!roles || roles.length === 0) {
      fetchRoles();
    }
  }, [roles, fetchRoles]);

  const roleOptions = useMemo(() => {
    return (roles || []).map((role) => ({
      label: role.name,
      value: String(role.id),
    }));
  }, [roles]);

  return {
    roleOptions,
    isRolesLoading: isLoading,
  };
}