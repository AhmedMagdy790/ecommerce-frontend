import { useState } from "react";

import type { EntityId } from "@/shared/types/entity";
import { useRole } from "../../hooks/useRole";
import { usePermissions } from "../../hooks/usePermissions";
import { useUpdateRolePermissions } from "../../hooks/useUpdateRolePermissions";

interface RolePermissionsDialogProps {
  roleId: EntityId | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RolePermissionsDialog({ roleId, isOpen, onClose }: RolePermissionsDialogProps) {
  const [selectedPermissionsState, setSelectedPermissionsState] = useState<string[] | null>(null);

  // 1. جلب بيانات الدور الحالي والصلاحيات المرتبطة به
  const { data: roleData, isLoading: isLoadingRole } = useRole(isOpen ? roleId ?? undefined : undefined);
  
  // 2. جلب كافة الصلاحيات المتاحة في النظام
  const { data: permissionsData, isLoading: isLoadingPermissions } = usePermissions();

  // 3. هوك التحديث (Mutation)
  const updatePermissionsMutation = useUpdateRolePermissions();

  if (!isOpen) return null;

  const rolePermissions = roleData?.data?.role?.permissions?.map((p) => p.name) ?? [];
  const selectedPermissions = selectedPermissionsState ?? rolePermissions;

  const handleCheckboxChange = (permissionName: string) => {
    setSelectedPermissionsState((prev) => {
      const currentPermissions = prev ?? rolePermissions;
      return currentPermissions.includes(permissionName)
        ? currentPermissions.filter((p) => p !== permissionName)
        : [...currentPermissions, permissionName];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleId === null) return;

    updatePermissionsMutation.mutate(
      {
        roleId,
        permissions: selectedPermissions,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  // تصفية الصلاحيات لإزالة التكرار بين (web و api) وعرض اسم الصلاحية مرة واحدة فقط
  const rawPermissions = permissionsData?.data?.permissions || [];
  const allPermissions = Array.from(
    new Map(rawPermissions.map((p) => [p.name, p])).values()
  );

  const roleName = roleData?.data?.role?.name || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            تعديل صلاحيات الدور: <span className="text-primary">{roleName}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {isLoadingRole || isLoadingPermissions ? (
          <div className="py-12 text-center text-gray-500">جاري التحميل...</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
              {allPermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.name)}
                    onChange={() => handleCheckboxChange(permission.name)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {permission.name}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 border-t pt-4 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={updatePermissionsMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {updatePermissionsMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}