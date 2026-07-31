// types/auth.types.ts


export interface IUser {
  id: number;
  name: string;
  addresses: string;
  phone: string;
  email: string;
  roles: string[];
  permissions: string[];
  is_verified: boolean;
  avatar: string;
  joinedAt: Date;
}

export interface ApiUserResponse {
  user: IUser,
  accessToken: string;
}

export interface ApiRotateResponse {
  refresh_updated: boolean;
}

export interface ApiUpdateTokenResponse {
  accessToken: string;
}


export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmed: string
}

export interface IRegisterResponse {
  user: IUser,
  accessToken: string
}

export interface IUserUpdatePayload {
  name: string;
  phone: string;
  addresses: string;
}


export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  isInitialized: boolean;
  isRefreshing: boolean,

  setUser: (user: IUser) => void;
  initializeAuth: () => void;
  setAccessToken: (token: string | null) => void;
  setInitialized: (val: boolean) => void;
  clearAuth: () => void;
  
  login: (data: ILoginPayload) => Promise<void>;
  createAcount: (data: IRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateAccessToken: () => Promise<string | null>;
  rotateAccessToken: () => Promise<boolean | null>;
  updateProfile: (data: IUserUpdatePayload) => Promise<IUser>;
}


export interface ILoginResponse {
  accessToken: string;
  expires_in: number;
  token_type: string;
  user: IUser;
}