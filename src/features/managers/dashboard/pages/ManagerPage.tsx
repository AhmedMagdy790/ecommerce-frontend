// src/features/managers/dashboard/pages/ManagerPage.tsx

import { useCallback, useMemo } from "react";
import { ShieldCheckIcon, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import DataTable from "@/shared/components/DataTable/DataTable";
import { getManagerColumns } from "../constants/ManagerColumns";
import { useMangerPage } from "../hooks/useMangerPage";
import type { User } from "@/features/users/model/types/user.types";
import ManagerModal from "../modal/ManagerModal";
import ChangeStatusModal from "../modal/ChangeStatusModal";

export default function ManagerPage() {
  const { t } = useTranslation("manager");
  const { lang } = useLang();

  const {
    currentData,
    isLoading,
    pagination,
    handleServerFilterOrPageChange,
    handleDelete,
    actionLoadingId,
    
    // Main Modal
    isOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,

    // Status Modal
    isStatusModalOpen,
    selectedUserForStatus,
    openStatusModal,
    closeStatusModal,
    confirmStatusChange,
  } = useMangerPage();

  const handleDeleteRow = useCallback(
    (item: User) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getManagerColumns({
        t,
        lang,
        onOpenStatusModal: openStatusModal,
      }),
    [t, lang, openStatusModal]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
            <span>
              {lang === "ar" ? "إدارة المشرفين والمدراء" : "Manager Management"}
            </span>
          </h1>
          <p className="text-xs lg:text-sm text-[var(--color-text-muted)] mt-1">
            {lang === "ar"
              ? "إدارة حسابات المشرفين وتعيين الأدوار والصلاحيات في النظام"
              : "Manage manager accounts, set functional roles, and modify permissions"}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm"
        >
          <Plus size={18} />
          <span>{lang === "ar" ? "إضافة مشرف جديد" : "Add New Manager"}</span>
        </button>
      </div>

      {/* Table */}
      <DataTable<User>
        data={currentData}
        loading={isLoading}
        meta={pagination}
        paginationMode="server"
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        onDelete={handleDeleteRow}
        onEdit={openEditModal}
      />

      {/* 1. مودال إضافة / تعديل البيانات */}
      <ManagerModal
        isOpen={isOpen}
        closeModal={closeModal}
        user={editingItem}
      />

      {/* 2. مودال تغيير الحالة */}
      <ChangeStatusModal
        key={selectedUserForStatus?.id || "status-modal"}
        isOpen={isStatusModalOpen}
        closeModal={closeStatusModal}
        userId={selectedUserForStatus?.id ?? null}
        currentStatus={selectedUserForStatus?.status}
        isLoading={actionLoadingId === selectedUserForStatus?.id}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}