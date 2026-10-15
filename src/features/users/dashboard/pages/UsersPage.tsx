// src/features/users/dashboard/ui/UsersPage.tsx

import { useCallback, useMemo } from "react";
import DataTable from "@/shared/components/DataTable/DataTable";
import type { User } from "../../model/types/user.types";
import { useLang } from "@/shared/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { useUserPage } from "../hook/useUserPage";
import { getUserColumns } from "../../constants/userColumns";
import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import UserModal from "../modal/UserModal"; // سنقوم بإنشائه لاحقاً

export default function UsersPage() {
  const { t } = useTranslation("user");
  const { lang } = useLang();

  const {
    currentData,
    isLoading,
    pagination,
    handleServerFilterOrPageChange,
    handleDelete,
    isModalOpen,
    editingUser,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useUserPage();

  const handleDeleteRow = useCallback(
    (item: User) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        t,
        lang,
      }),
    [t, lang]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}


    <HeaderDashboard
        t={t}
        title={t("user.title", "Users Management")}
        openCreateModal={openCreateModal}
        createButtonLabel={t("user.add", "Add new user")}
        // حذفنا openCreateModal من هنا
    />


      {/* DataTable Component */}
      <DataTable<User>
        data={currentData}
        loading={isLoading}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
      />

      {/* User Modal (Create / Edit) */}
      
      <UserModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        user={editingUser}
      /> 
     
    </div>
  );
}