import { useState } from "react";
import { useTranslation } from "react-i18next";
import BaseModel from "@/shared/components/BaseModal";
import CustomSelect from "@/shared/components/CustomSelect";
import type { UserStatus } from "@/features/users/model/types/user.types";
import type { EntityId } from "@/shared/types/entity";

interface ChangeStatusModalProps {
  isOpen: boolean;
  closeModal: () => void;
  userId: EntityId | null;
  currentStatus?: UserStatus;
  isLoading?: boolean;
  onConfirm: (id: EntityId, status: UserStatus) => void;
}

export default function ChangeStatusModal({
  isOpen,
  closeModal,
  userId,
  currentStatus = "pending",
  isLoading = false,
  onConfirm,
}: ChangeStatusModalProps) {
  const { t: tc } = useTranslation("common");

  const [prevStatus, setPrevStatus] = useState<UserStatus>(currentStatus);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(currentStatus);

  if (prevStatus !== currentStatus) {
    setPrevStatus(currentStatus);
    setSelectedStatus(currentStatus);
  }

  const statusOptions = [
    { label: `🟢 ${tc("status.active", "نشط")}`, value: "active" },
    { label: `🟡 ${tc("status.pending", "قيد الانتظار")}`, value: "pending" },
    { label: `🔴 ${tc("statuses.suspended", "معلق / محظور")}`, value: "suspended" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && selectedStatus) {
      onConfirm(userId, selectedStatus);
    }
  };

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isLoading}
      closeModal={closeModal}
      title={tc("statuses.changeTitle", "تغيير حالة المشرف")}
      description={tc("statuses.changeDescription", "اختر الحالة الجديدة لتطبيقها على المشرف")}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <CustomSelect
          label={tc("status.label", "الحالة")}
          options={statusOptions}
          value={selectedStatus}
          onChange={(val) => setSelectedStatus(val as UserStatus)}
        />

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {tc("cancel", "إلغاء")}
          </button>
          <button
            type="submit"
            disabled={isLoading || selectedStatus === currentStatus}
            className="px-4 py-2 text-xs font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? tc("saving", "جاري الحفظ...") : tc("save", "حفظ")}
          </button>
        </div>
      </form>
    </BaseModel>
  );
}