// src/shared/components/DataTable/TableActions.tsx
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next"; // أو المسار الخاص بـ Hook الترجمة لديك

interface TableActionsProps<T> {
  item: T;
  showTrashed?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRestore?: (item: T) => void;
}

export function TableActions<T>({
  item,
  showTrashed,
  onEdit,
  onDelete,
  onRestore,
}: TableActionsProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center gap-2">
      {!showTrashed ? (
        <>
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={t("actions.edit", "Edit")}
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--red-500)]/10 text-[var(--color-error)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={t("actions.delete", "Delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <>
          {onRestore && (
            <button
              onClick={() => onRestore(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-success)]/10 text-[var(--color-success)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={t("actions.restore", "Restore")}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--red-500)]/10 text-[var(--color-error)] transition-all active:scale-95 shadow-[var(--shadow-xs)]"
              title={t("actions.permanentDelete", "Permanent Delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}