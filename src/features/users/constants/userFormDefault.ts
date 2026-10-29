// src/features/users/dashboard/constants/userFormDefault.ts

import type { UserFormData } from "../model/schema/userSchema";

export const defaultUserValues: UserFormData = {
  name: "",
  email: "",
  phone: "",
  status: "active",
  roles: [],
  avatar: null,
  password: "",
  password_confirmed: "",
};