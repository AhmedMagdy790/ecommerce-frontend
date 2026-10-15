import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";
import type { User, UserStats } from "./user.types";


export type UserListResponse =
  SuccessApiResponse<{
    items: User[];
    pagination: PaginationMeta;
    stats: UserStats;
  }>;

export type UserSingleResponse = SuccessApiResponse<{ user: User}>;