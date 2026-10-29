// src/features/user/constants/userFormDefault.ts
import type { UserFormData } from "../../model/schema/userSchema";

export const userFromDefault: UserFormData = {
    name: "",
    email: "",
    status: "pending",
    roles: [],
    phone: "",
    password: "",
    password_confirmed: "",
};