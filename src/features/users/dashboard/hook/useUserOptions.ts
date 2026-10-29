import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "../../model/store/useUserStore";
import type { UserFilters } from "../../model/types/user.types";

interface UseUserOptionsProps {
  initialUserId?: number | string | null;
  filters?: Partial<UserFilters>;
}

export function useUserOptions({ initialUserId, filters }: UseUserOptionsProps = {}) {
  const { items: users, fetch: fetchUsers, isFetching: isUsersLoading } = useUserStore();

  const [selectedUserId, setSelectedUserId] = useState<number | string | null>(
    initialUserId ?? null
  );

  const search = filters?.search;
  const status = filters?.status;
  const role = filters?.role;

  const filterParams = useMemo(() => {
    return {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(role ? { role } : {}),
    };
  }, [search, status, role]);

  useEffect(() => {
    fetchUsers(filterParams);
  }, [fetchUsers, filterParams]);

  const handleUserChange = (userId: number | string | null) => {
    setSelectedUserId(userId);
  };

  const userOptions = useMemo(() => {
    return (users || []).map((user) => ({
      label: user.name,
      value: user.id,
    }));
  }, [users]);

  return {
    users,
    userOptions,
    isUsersLoading,
    selectedUserId,
    handleUserChange,
    refetchUsers: () => fetchUsers(filterParams),
  };
}