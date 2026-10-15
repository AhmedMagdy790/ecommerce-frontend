// src/features/managers/dashboard/mappers/mapUserForm.ts

import { defaultUserValues } from "../../constants/userFormDefault";
import type { UserFormData } from "../../model/schema/userSchema";
import type { InitialUserData } from "../../model/types/user.from.typs";


export function mapUserToForm(
  user?: InitialUserData | null
): UserFormData {
  if (!user) {
    return defaultUserValues;
  }

  return {
    ...defaultUserValues,
    name: user.name ?? defaultUserValues.name,
    email: user.email ?? defaultUserValues.email,
    phone: user.phone ?? defaultUserValues.phone,
    status: user.status ?? "active",
    avatar: user.avatar ?? null,
    roles: user.roles ? user.roles.map((role) => role.id) : [],
    // لا يتم ملء كلمة المرور في حقل التعديل لأسباب أمنية
    password: "",
    password_confirmation: "",
  };
}