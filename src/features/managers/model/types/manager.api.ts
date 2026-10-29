import type { User, UserStats } from "@/features/users/model/types/user.types";
import type { PaginationMeta, SuccessApiResponse } from "@/shared/types/api.types";


export type ManagerListResponse =
  SuccessApiResponse<{
    items: User[];
    pagination: PaginationMeta;
    stats: UserStats;
  }>;

export type ManagerSingleResponse = SuccessApiResponse<{ user: User}>;