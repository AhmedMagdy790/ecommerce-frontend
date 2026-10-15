// src/features/profile/mappers/mapProfileForm.ts
import type { ProfileFormInput } from "../model/schema/profileSchema";
import type { User } from "@/features/auth/model/types/user.types";

export const mapUserToProfileForm = (user: User): ProfileFormInput => ({
  name: user.name || "",
  email: user.email || "",
  phone: user.phone || "",
});