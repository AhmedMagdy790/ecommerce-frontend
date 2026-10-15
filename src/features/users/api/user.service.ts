import { adminApi } from "@/api/client";
import type {
  SuccessApiResponse,
} from "@/shared/types/api.types";
import type { CreateUserDto, UpdateUserDto } from "../model/types/user.dto";
import type { UserFilters } from "../model/types/user.types";
import type { UserListResponse, UserSingleResponse } from "../model/types/user.api";

export const userService = {
  getAll(filters?: UserFilters) {
    return adminApi.getCustomers<UserListResponse>(filters);
  },
  get(id: number | string) {
    return adminApi.getCustomerById<UserSingleResponse>(id);
  },
  create(payload: CreateUserDto) {
    return adminApi.createCustomer<
      UserSingleResponse,
      CreateUserDto
    >(payload);
  },
  update(id: number | string, payload: UpdateUserDto) {
    return adminApi.updateCustomer<
      UserSingleResponse,
      UpdateUserDto
    >(id, payload);
  },
  delete(id: number | string) {
    return adminApi.deleteCustomer<SuccessApiResponse<null>>(id);
  },
};

export default userService;
