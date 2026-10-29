// src/features/profile/mappers/mapProfileForm.ts
import type { User } from "@/features/users/model/types/user.types";
import type { ProfileFormInput } from "../model/schema/profileSchema";

export const mapUserToProfileForm = (user: User): ProfileFormInput => ({
  name: user.name || "",
  email: user.email || "",
  phone: user.phone || "",
});