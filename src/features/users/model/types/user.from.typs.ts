// src/pages/user/model/types/user.types.ts
import type { UserStatus } from "./user.types";
import type { Role } from "@/features/roles/model/types/permission.types";

export type InitialUserData = {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  roles?: Role[];
  avatar?: string | null;
  status: UserStatus;
};