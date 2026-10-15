// src/features/users/model/types/user.dto.ts

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  password?: string;
  password_confirmation?: string;
  roles?: string[];
  avatar?: File | string | null;
}

export type UpdateUserDto = Partial<CreateUserDto>;

// src/features/auth/model/types/auth.dto.ts

export interface LoginDto {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePasswordDto {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateAvatarDto {
  avatar: File | string;
}