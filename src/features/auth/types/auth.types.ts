import type { User } from "./user.types";

export interface RegisterPayload {
    name:string;
    phone?:string;
    email:string;
    password:string;
    password_confirmation:string;
}

export interface LoginPayload {
    email:string;
    password:string;
}

export interface AuthResponse {
    user:User;
    accessToken:string;
    token_type:string;
    expires_in:number;
    access_expires_at?:string;
    refresh_expires_at?:string;
}