import { useForm } from "react-hook-form";
import type { Role } from "../../model/types/permission.types";

interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: { name: string }) => void;
  isLoading?: boolean;
}

export function RoleForm({ initialData, onSubmit, isLoading }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          اسم الدور (Role Name)
        </label>
        <input
          type="text"
          {...register("name", { required: "اسم الدور مطلوب" })}
          disabled // اسم الدور محمي ولا يُعدل
          className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-500 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          ملاحظة: أسماء الأدوار محددة برمجياً ولا يمكن تعديلها من لوحة التحكم.
        </p>
      </div>

      {/* زر الحفظ / الإرسال الذي كان مفقوداً */}
      <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}