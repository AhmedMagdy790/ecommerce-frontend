import type { z } from "zod";
import type { registerSchema } from "@/features/auth/model/schema/registerSchema";
import type { forgotPasswordSchema } from "@/features/auth/model/schema/forgotPasswordSchema";
import type { updateUserSchema } from "@/features/auth/model/schema/updateUserSchema";
import type { userSchema } from "@/features/users/model/schema/userSchema";
import type { loginSchema } from "../schema/loginSchema";



export type CreateUserDto = z.infer<typeof userSchema>;

export type UpdateUserDto = Partial<CreateUserDto>;

export type RegisterDto = z.infer<typeof registerSchema>
export type LoginDto = z.infer<typeof loginSchema>


export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>

export type UpdatePasswordDto = z.infer<typeof updateUserSchema>;