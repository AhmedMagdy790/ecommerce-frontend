// src/features/auth/hooks/useAuthPermissions.ts
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

export function useAuthPermissions() {
  const { user } = useAuth();

  const userRoles = useMemo(() => {
    if (!user || !user.roles) return [];
    return user.roles;
  }, [user]);

  const isAdminOrManager = useMemo(() => {
    return userRoles.some((role: { name: string }) => {
      const roleName = role?.name;
      return ["admin", "super-admin", "manager"].includes(roleName?.toLowerCase());
    });
  }, [userRoles]);


  const isProvider = useMemo(() => {
    return userRoles.some((role: { name: string }) => {
      const roleName = role?.name;
      return roleName?.toLowerCase() === "provider";
    });
  }, [userRoles]);

  return {
    userRoles,
    isAdminOrManager,
    isProvider,
    canAccessDashboard: isAdminOrManager || isProvider,
  };
}