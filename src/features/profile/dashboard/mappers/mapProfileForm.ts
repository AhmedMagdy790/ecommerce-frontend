// src/features/profile/dashboard/mappers/mapProfileForm.ts
import type { User } from "@/features/users/model/types/user.types";
import type { ProfileFormInput } from "../model/schema/profileSchema";

/** Maps profile data to form fields, using empty strings for missing values. */
export const mapUserToProfileForm = (user: User): ProfileFormInput => ({
  name: user.name || "",
  email: user.email || "",
  phone: user.phone || "",
});