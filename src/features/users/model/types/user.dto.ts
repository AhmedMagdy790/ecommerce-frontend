import type { z } from "zod";
import type { userSchema } from "../schema/userSchema";
import type { registerSchema } from "@/features/auth/model/schema/registerSchema";
import type { forgotPasswordSchema } from "@/features/auth/model/schema/forgotPasswordSchema";
import type { updateUserSchema } from "@/features/auth/model/schema/updateUserSchema";


export interface UpdateProfilePayload {
  name: string;
  phone?: string | null;
}


export type CreateUserDto = z.infer<typeof userSchema>;

export type UpdateUserDto = Partial<CreateUserDto>;

export type RegisterDto = z.infer<typeof registerSchema>


export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>

export type UpdatePasswordDto = z.infer<typeof updateUserSchema>;