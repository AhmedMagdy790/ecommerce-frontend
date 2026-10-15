
import type { EntityId } from "@/shared/types/entity";
import type { Role } from "../../model/types/permission.types";

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onEditPermissions: (roleId: EntityId) => void;
}

export function RoleTable({ roles, isLoading, onEditPermissions }: RoleTableProps) {
  if (isLoading) {
    return <div className="py-12 text-center text-gray-500">جاري تحميل الأدوار...</div>;
  }

  if (!roles || roles.length === 0) {
    return <div className="py-12 text-center text-gray-500">لا توجد أدوار متاحة حالياً.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-4"># ID</th>
            <th scope="col" className="px-6 py-4">اسم الدور (Role)</th>
            <th scope="col" className="px-6 py-4">حارس النظام (Guard)</th>
            <th scope="col" className="px-6 py-4">عدد الصلاحيات</th>
            <th scope="col" className="px-6 py-4 text-right">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {String(role.id)}
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                {role.name}
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {role.guard_name}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  {role.permissions?.length || 0} صلاحية
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onEditPermissions(role.id)}
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                >
                  تعديل الصلاحيات
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}