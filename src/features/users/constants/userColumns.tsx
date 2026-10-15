// src/features/users/constants/userColumns.tsx

import type { Column } from "@/shared/components/DataTable/types";
import type { User } from "../model/types/user.types";
import type { TFunction } from "i18next";
import { TableCellImage } from "@/shared/components/DataTable/TableCellImage";

interface GetUserColumnsProps {
  t: TFunction;
  lang: string;
}

export function getUserColumns({
  t,
}: GetUserColumnsProps): Column<User>[] {
  return [
    {
      id: "name",
      header: t("user.name", "Name"),
      accessor: "name",
    },
    {
      id: "avatar",
      header: t("user.avatar", "Avatar"),
      accessor: (row) => row.avatar,
      render: (_value, row) => (
        <TableCellImage
          src={typeof row.avatar === "string" ? row.avatar : null}
          alt={row.name}
          rounded="full"
        />
      ),
    },
    {
      id: "email",
      header: t("user.email", "Email"),
      accessor: "email",
    },
    {
      id: "phone",
      header: t("user.phone", "Phone"),
      accessor: (row) => row.phone ?? "-",
    },
    {
      id: "roles",
      header: t("user.roles", "Roles"),
      accessor: (row) => row.roles?.join(", ") || "-",
    },
  ];
}