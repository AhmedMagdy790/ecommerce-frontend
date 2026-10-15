import { createFeatureStore } from "@/shared/store/createFeatureStore";
import type {
  SuccessApiResponse,
} from "@/shared/types/api.types";
import type { CreateUserDto, UpdateUserDto } from "../types/user.dto";
import type { User, UserFilters, UserStats } from "../types/user.types";
import userService from "../../api/user.service";
import { userAdapter } from "../../adapters/user.adapter";
import { DEFAULT_USER_FILTERS } from "../../constants/user.constants";
import type { UserListResponse, UserSingleResponse } from "../types/user.api";

export const useUserStore = createFeatureStore<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserFilters,
  UserListResponse,
  UserSingleResponse,
  SuccessApiResponse<null>,
  UserSingleResponse, // TUpdateRes
  SuccessApiResponse<null>,               // TTrashRes
  SuccessApiResponse<null>,               // TRestoreRes
  SuccessApiResponse<null>,               // TForceDeleteRes
  Record<string, never>,                  // TCustomState
  UserStats                               // TStats
>({
  name: "UserStore",
  service: userService,
  adapter: userAdapter,
  defaultFilters: DEFAULT_USER_FILTERS,
  defaultSortBy: "name",
});