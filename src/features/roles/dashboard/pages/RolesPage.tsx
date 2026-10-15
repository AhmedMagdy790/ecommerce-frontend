import { useState } from "react";
import { RoleTable } from "../components/RoleTable";
import { RolePermissionsDialog } from "../components/RolePermissionsDialog";
import type { EntityId } from "@/shared/types/entity";
import { useRoles } from "../../hooks/useRoles";

export default function RolesPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<EntityId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // جلب قائمة الأدوار باستخدام TanStack Query Hook
  const { data, isLoading, error } = useRoles();

  // استخراج الأدوار من هيكل استجابة الـ API
  const roles = data?.data?.roles || [];

  const handleOpenPermissionsDialog = (roleId: EntityId) => {
    setSelectedRoleId(roleId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoleId(null);
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        حدث خطأ أثناء تحميل الأدوار والصلاحيات.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            إدارة الأدوار والصلاحيات
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            استعراض الأدوار النظامية وتعديل الصلاحيات المرتبطة بكل دور.
          </p>
        </div>
      </div>

      {/* جدول عرض الأدوار */}
      <RoleTable
        roles={roles}
        isLoading={isLoading}
        onEditPermissions={handleOpenPermissionsDialog}
      />

      {/* مودال تعديل الصلاحيات */}
      <RolePermissionsDialog
        roleId={selectedRoleId}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}