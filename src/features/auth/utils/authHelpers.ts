// src/features/auth/utils/authHelpers.ts

import type { User } from "../model/types/user.types"; // استورد نوع المستخدم لديك


export const hasRole = (user: User | null, roleName: string): boolean => {
  if (!user || !Array.isArray(user.roles)) return false;

  
  return user.roles.some(
    (role) => role?.name?.toLowerCase() === roleName.toLowerCase()
  );
};


export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, "admin");
};